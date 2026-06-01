;; ============================================================================
;; BITVAULT - Membership Badge NFT (SIP-009)
;; ============================================================================
;; Non-fungible membership badges that can be issued to vault members. Each
;; badge records the vault it belongs to and a tier label.
;; ============================================================================

(define-non-fungible-token membership-badge uint)

(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u700))
(define-constant ERR-NOT-TOKEN-OWNER (err u701))
(define-constant ERR-TOKEN-NOT-FOUND (err u702))
(define-constant ERR-INVALID-RECIPIENT (err u703))

(define-data-var last-token-id uint u0)
(define-data-var base-uri (string-ascii 80) "https://bitvault.app/badge/")

;; Per-token metadata: which vault the badge is for and its tier.
(define-map token-meta
  { token-id: uint }
  {
    vault-id: uint,
    tier: (string-ascii 16),
  }
)

;; ---------------------------------------------------------------------------
;; SIP-009 Read-Only
;; ---------------------------------------------------------------------------

(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

(define-read-only (get-token-uri (token-id uint))
  (ok (some (concat (var-get base-uri) (int-to-ascii token-id))))
)

(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? membership-badge token-id))
)

(define-read-only (get-token-meta (token-id uint))
  (map-get? token-meta { token-id: token-id })
)

;; ---------------------------------------------------------------------------
;; SIP-009 Transfer
;; ---------------------------------------------------------------------------

(define-public (transfer
    (token-id uint)
    (sender principal)
    (recipient principal)
  )
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (nft-transfer? membership-badge token-id sender recipient)
  )
)

;; ---------------------------------------------------------------------------
;; Mint & Admin
;; ---------------------------------------------------------------------------

;; Mint a membership badge to a recipient (contract owner only).
(define-public (mint
    (recipient principal)
    (vault-id uint)
    (tier (string-ascii 16))
  )
  (let ((token-id (+ (var-get last-token-id) u1)))
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (try! (nft-mint? membership-badge token-id recipient))
    (map-set token-meta { token-id: token-id } {
      vault-id: vault-id,
      tier: tier,
    })
    (var-set last-token-id token-id)
    (print {
      event: "badge-minted",
      token-id: token-id,
      recipient: recipient,
      vault-id: vault-id,
      tier: tier,
    })
    (ok token-id)
  )
)

;; Burn a badge held by the caller.
(define-public (burn (token-id uint))
  (let ((owner (unwrap! (nft-get-owner? membership-badge token-id) ERR-TOKEN-NOT-FOUND)))
    (asserts! (is-eq tx-sender owner) ERR-NOT-TOKEN-OWNER)
    (try! (nft-burn? membership-badge token-id owner))
    (map-delete token-meta { token-id: token-id })
    (print { event: "badge-burned", token-id: token-id })
    (ok true)
  )
)

;; Update the base metadata URI (contract owner only).
(define-public (set-base-uri (new-uri (string-ascii 80)))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (var-set base-uri new-uri)
    (ok true)
  )
)
