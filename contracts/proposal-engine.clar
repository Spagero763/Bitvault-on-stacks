;; ============================================================================
;; BITVAULT - Proposal Engine Contract
;; ============================================================================
;; Manages governance proposals: creation, status transitions, execution.
;; ============================================================================

(define-constant ERR-NOT-AUTHORIZED (err u300))
(define-constant ERR-VAULT-NOT-FOUND (err u301))
(define-constant ERR-PROPOSAL-NOT-FOUND (err u302))
(define-constant ERR-PROPOSAL-EXPIRED (err u303))
(define-constant ERR-PROPOSAL-NOT-ACTIVE (err u304))
(define-constant ERR-PROPOSAL-ALREADY-EXECUTED (err u305))
(define-constant ERR-INVALID-TITLE (err u306))
(define-constant ERR-INVALID-DURATION (err u307))
(define-constant ERR-QUORUM-NOT-MET (err u308))
(define-constant ERR-THRESHOLD-NOT-MET (err u309))
(define-constant ERR-TIMELOCK-ACTIVE (err u310))
(define-constant ERR-INVALID-AMOUNT (err u311))

(define-constant STATUS-ACTIVE u1)
(define-constant STATUS-PASSED u2)
(define-constant STATUS-REJECTED u3)
(define-constant STATUS-EXECUTED u4)
(define-constant STATUS-EXPIRED u5)

(define-constant TYPE-TRANSFER u1)
(define-constant TYPE-ADD-MEMBER u2)
(define-constant TYPE-REMOVE-MEMBER u3)
(define-constant TYPE-CHANGE-THRESHOLD u4)
(define-constant TYPE-CUSTOM u5)

(define-constant TIMELOCK-PERIOD u144)
(define-constant MIN-VOTING-PERIOD u72)
(define-constant MAX-VOTING-PERIOD u4320)

;; ---------------------------------------------------------------------------
;; Data
;; ---------------------------------------------------------------------------
(define-data-var proposal-nonce uint u0)

(define-map proposals
  { proposal-id: uint }
  {
    vault-id: uint,
    proposer: principal,
    title: (string-ascii 128),
    description: (string-ascii 512),
    proposal-type: uint,
    status: uint,
    created-at: uint,
    expires-at: uint,
    executed-at: uint,
    yes-votes: uint,
    no-votes: uint,
    required-votes: uint,
    target-principal: (optional principal),
    target-amount: uint,
    timelock-end: uint
  }
)

(define-map proposal-voters
  { proposal-id: uint, voter: principal }
  { vote: bool, voted-at: uint }
)

;; ---------------------------------------------------------------------------
;; Read-Only
;; ---------------------------------------------------------------------------

(define-read-only (get-proposal (proposal-id uint))
  (map-get? proposals { proposal-id: proposal-id })
)

(define-read-only (get-proposal-status (proposal-id uint))
  (match (map-get? proposals { proposal-id: proposal-id })
    proposal (ok (get status proposal))
    ERR-PROPOSAL-NOT-FOUND
  )
)

(define-read-only (has-voted (proposal-id uint) (voter principal))
  (is-some (map-get? proposal-voters { proposal-id: proposal-id, voter: voter }))
)

(define-read-only (get-voter-info (proposal-id uint) (voter principal))
  (map-get? proposal-voters { proposal-id: proposal-id, voter: voter })
)

(define-read-only (get-proposal-nonce)
  (var-get proposal-nonce)
)

(define-read-only (is-proposal-active (proposal-id uint))
  (match (map-get? proposals { proposal-id: proposal-id })
    proposal (and
      (is-eq (get status proposal) STATUS-ACTIVE)
      (<= stacks-block-height (get expires-at proposal))
    )
    false
  )
)

(define-read-only (is-proposal-executable (proposal-id uint))
  (match (map-get? proposals { proposal-id: proposal-id })
    proposal (and
      (is-eq (get status proposal) STATUS-PASSED)
      (>= stacks-block-height (get timelock-end proposal))
    )
    false
  )
)

;; ---------------------------------------------------------------------------
;; Public Functions
;; ---------------------------------------------------------------------------

(define-public (create-proposal
    (vault-id uint)
    (title (string-ascii 128))
    (description (string-ascii 512))
    (proposal-type uint)
    (voting-period uint)
    (target-principal (optional principal))
    (target-amount uint)
  )
  (let
    (
      (new-id (var-get proposal-nonce))
      (caller tx-sender)
      (vault (unwrap! (contract-call? .multisig-vault get-vault vault-id) ERR-VAULT-NOT-FOUND))
    )
    (asserts! (contract-call? .multisig-vault is-member vault-id caller) ERR-NOT-AUTHORIZED)
    (asserts! (> (len title) u0) ERR-INVALID-TITLE)
    (asserts! (>= voting-period MIN-VOTING-PERIOD) ERR-INVALID-DURATION)
    (asserts! (<= voting-period MAX-VOTING-PERIOD) ERR-INVALID-DURATION)

    (map-set proposals
      { proposal-id: new-id }
      {
        vault-id: vault-id,
        proposer: caller,
        title: title,
        description: description,
        proposal-type: proposal-type,
        status: STATUS-ACTIVE,
        created-at: stacks-block-height,
        expires-at: (+ stacks-block-height voting-period),
        executed-at: u0,
        yes-votes: u0,
        no-votes: u0,
        required-votes: (get threshold vault),
        target-principal: target-principal,
        target-amount: target-amount,
        timelock-end: u0
      }
    )

    (var-set proposal-nonce (+ new-id u1))
    (ok new-id)
  )
)

(define-public (finalize-proposal (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) ERR-PROPOSAL-NOT-FOUND))
    )
    (asserts! (is-eq (get status proposal) STATUS-ACTIVE) ERR-PROPOSAL-NOT-ACTIVE)

    (if (>= (get yes-votes proposal) (get required-votes proposal))
      (begin
        (map-set proposals
          { proposal-id: proposal-id }
          (merge proposal {
            status: STATUS-PASSED,
            timelock-end: (+ stacks-block-height TIMELOCK-PERIOD)
          })
        )
        (ok STATUS-PASSED)
      )
      (if (> stacks-block-height (get expires-at proposal))
        (begin
          (map-set proposals
            { proposal-id: proposal-id }
            (merge proposal { status: STATUS-REJECTED })
          )
          (ok STATUS-REJECTED)
        )
        (ok STATUS-ACTIVE)
      )
    )
  )
)

(define-public (mark-executed (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) ERR-PROPOSAL-NOT-FOUND))
    )
    (asserts! (is-eq (get status proposal) STATUS-PASSED) ERR-PROPOSAL-NOT-ACTIVE)
    (asserts! (>= stacks-block-height (get timelock-end proposal)) ERR-TIMELOCK-ACTIVE)

    (map-set proposals
      { proposal-id: proposal-id }
      (merge proposal {
        status: STATUS-EXECUTED,
        executed-at: stacks-block-height
      })
    )

    (ok true)
  )
)
