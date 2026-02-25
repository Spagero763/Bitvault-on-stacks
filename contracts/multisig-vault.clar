;; ============================================================================
;; BITVAULT - Multi-Signature Vault Contract
;; ============================================================================
;; Manages vault creation, member enrollment, threshold configuration,
;; and authorization checks for multi-sig operations.
;; ============================================================================

;; ---------------------------------------------------------------------------
;; Constants & Error Codes
;; ---------------------------------------------------------------------------
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-VAULT-EXISTS (err u101))
(define-constant ERR-VAULT-NOT-FOUND (err u102))
(define-constant ERR-MEMBER-EXISTS (err u103))
(define-constant ERR-MEMBER-NOT-FOUND (err u104))
(define-constant ERR-INVALID-THRESHOLD (err u105))
(define-constant ERR-MAX-MEMBERS-REACHED (err u106))
(define-constant ERR-CANNOT-REMOVE-OWNER (err u107))
(define-constant ERR-THRESHOLD-TOO-HIGH (err u108))
(define-constant ERR-VAULT-LOCKED (err u109))
(define-constant ERR-INVALID-NAME (err u110))

(define-constant MAX-MEMBERS u20)

;; ---------------------------------------------------------------------------
;; Data Variables
;; ---------------------------------------------------------------------------
(define-data-var vault-nonce uint u0)

;; ---------------------------------------------------------------------------
;; Data Maps
;; ---------------------------------------------------------------------------

;; Vault metadata
(define-map vaults
  { vault-id: uint }
  {
    name: (string-ascii 64),
    owner: principal,
    threshold: uint,
    member-count: uint,
    created-at: uint,
    is-locked: bool,
  }
)

;; Vault membership
(define-map vault-members
  {
    vault-id: uint,
    member: principal,
  }
  {
    added-at: uint,
    role: (string-ascii 16),
  }
)

;; Track vaults by owner
(define-map owner-vault-count
  { owner: principal }
  { count: uint }
)

;; ---------------------------------------------------------------------------
;; Read-Only Functions
;; ---------------------------------------------------------------------------

(define-read-only (get-vault (vault-id uint))
  (map-get? vaults { vault-id: vault-id })
)

(define-read-only (get-vault-member
    (vault-id uint)
    (member principal)
  )
  (map-get? vault-members {
    vault-id: vault-id,
    member: member,
  })
)

(define-read-only (is-member
    (vault-id uint)
    (who principal)
  )
  (is-some (map-get? vault-members {
    vault-id: vault-id,
    member: who,
  }))
)

(define-read-only (is-vault-owner
    (vault-id uint)
    (who principal)
  )
  (match (map-get? vault-members {
    vault-id: vault-id,
    member: who,
  })
    member-data (is-eq (get role member-data) "owner")
    false
  )
)

(define-read-only (get-vault-threshold (vault-id uint))
  (match (map-get? vaults { vault-id: vault-id })
    vault-data (ok (get threshold vault-data))
    ERR-VAULT-NOT-FOUND
  )
)

(define-read-only (get-vault-member-count (vault-id uint))
  (match (map-get? vaults { vault-id: vault-id })
    vault-data (ok (get member-count vault-data))
    ERR-VAULT-NOT-FOUND
  )
)

(define-read-only (get-vault-nonce)
  (var-get vault-nonce)
)

(define-read-only (get-owner-vault-count (owner principal))
  (default-to { count: u0 } (map-get? owner-vault-count { owner: owner }))
)

;; ---------------------------------------------------------------------------
;; Public Functions
;; ---------------------------------------------------------------------------

;; Create a new multi-sig vault
(define-public (create-vault
    (name (string-ascii 64))
    (threshold uint)
  )
  (let (
      (new-id (var-get vault-nonce))
      (caller tx-sender)
    )
    (asserts! (> (len name) u0) ERR-INVALID-NAME)
    (asserts! (>= threshold u1) ERR-INVALID-THRESHOLD)
    (asserts! (<= threshold MAX-MEMBERS) ERR-THRESHOLD-TOO-HIGH)

    (map-set vaults { vault-id: new-id } {
      name: name,
      owner: caller,
      threshold: threshold,
      member-count: u1,
      created-at: stacks-block-height,
      is-locked: false,
    })

    (map-set vault-members {
      vault-id: new-id,
      member: caller,
    } {
      added-at: stacks-block-height,
      role: "owner",
    })

    (map-set owner-vault-count { owner: caller } { count: (+ (get count (get-owner-vault-count caller)) u1) })

    (var-set vault-nonce (+ new-id u1))
    (ok new-id)
  )
)

;; Add a member to the vault
(define-public (add-member
    (vault-id uint)
    (new-member principal)
    (role (string-ascii 16))
  )
  (let (
      (vault (unwrap! (map-get? vaults { vault-id: vault-id }) ERR-VAULT-NOT-FOUND))
      (caller tx-sender)
      (current-count (get member-count vault))
    )
    (asserts! (is-vault-owner vault-id caller) ERR-NOT-AUTHORIZED)
    (asserts! (not (get is-locked vault)) ERR-VAULT-LOCKED)
    (asserts! (not (is-member vault-id new-member)) ERR-MEMBER-EXISTS)
    (asserts! (< current-count MAX-MEMBERS) ERR-MAX-MEMBERS-REACHED)

    (map-set vault-members {
      vault-id: vault-id,
      member: new-member,
    } {
      added-at: stacks-block-height,
      role: role,
    })

    (map-set vaults { vault-id: vault-id }
      (merge vault { member-count: (+ current-count u1) })
    )

    (ok true)
  )
)

;; Remove a member from the vault
(define-public (remove-member
    (vault-id uint)
    (member principal)
  )
  (let (
      (vault (unwrap! (map-get? vaults { vault-id: vault-id }) ERR-VAULT-NOT-FOUND))
      (caller tx-sender)
      (current-count (get member-count vault))
    )
    (asserts! (is-vault-owner vault-id caller) ERR-NOT-AUTHORIZED)
    (asserts! (not (get is-locked vault)) ERR-VAULT-LOCKED)
    (asserts! (not (is-vault-owner vault-id member)) ERR-CANNOT-REMOVE-OWNER)
    (asserts! (is-member vault-id member) ERR-MEMBER-NOT-FOUND)
    (asserts! (> current-count (get threshold vault)) ERR-THRESHOLD-TOO-HIGH)

    (map-delete vault-members {
      vault-id: vault-id,
      member: member,
    })

    (map-set vaults { vault-id: vault-id }
      (merge vault { member-count: (- current-count u1) })
    )

    (ok true)
  )
)

;; Update the signing threshold
(define-public (set-threshold
    (vault-id uint)
    (new-threshold uint)
  )
  (let (
      (vault (unwrap! (map-get? vaults { vault-id: vault-id }) ERR-VAULT-NOT-FOUND))
      (caller tx-sender)
    )
    (asserts! (is-vault-owner vault-id caller) ERR-NOT-AUTHORIZED)
    (asserts! (not (get is-locked vault)) ERR-VAULT-LOCKED)
    (asserts! (>= new-threshold u1) ERR-INVALID-THRESHOLD)
    (asserts! (<= new-threshold (get member-count vault)) ERR-THRESHOLD-TOO-HIGH)

    (map-set vaults { vault-id: vault-id }
      (merge vault { threshold: new-threshold })
    )

    (ok true)
  )
)

;; Toggle vault lock
(define-public (toggle-lock (vault-id uint))
  (let (
      (vault (unwrap! (map-get? vaults { vault-id: vault-id }) ERR-VAULT-NOT-FOUND))
      (caller tx-sender)
    )
    (asserts! (is-vault-owner vault-id caller) ERR-NOT-AUTHORIZED)

    (map-set vaults { vault-id: vault-id }
      (merge vault { is-locked: (not (get is-locked vault)) })
    )

    (ok true)
  )
)
