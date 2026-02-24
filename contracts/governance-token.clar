;; ============================================================================
;; BITVAULT - Governance Token (SIP-010 Compliant)
;; ============================================================================
;; BVT (BitVault Token) - governance token for token-weighted voting.
;; ============================================================================

(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u200))
(define-constant ERR-INSUFFICIENT-BALANCE (err u201))
(define-constant ERR-INVALID-AMOUNT (err u202))
(define-constant ERR-MINT-FAILED (err u203))

(define-constant TOKEN-NAME "BitVault Token")
(define-constant TOKEN-SYMBOL "BVT")
(define-constant TOKEN-DECIMALS u6)
(define-constant MAX-SUPPLY u1000000000000)

(define-fungible-token bitvault-token u1000000000000)

(define-data-var token-uri (optional (string-utf8 256)) (some u"https://bitvault.app/token-metadata.json"))
(define-data-var total-minted uint u0)

;; SIP-010 Read-Only
(define-read-only (get-name)
  (ok TOKEN-NAME)
)

(define-read-only (get-symbol)
  (ok TOKEN-SYMBOL)
)

(define-read-only (get-decimals)
  (ok TOKEN-DECIMALS)
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance bitvault-token account))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply bitvault-token))
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

(define-read-only (get-total-minted)
  (ok (var-get total-minted))
)

;; SIP-010 Transfer
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (try! (ft-transfer? bitvault-token amount sender recipient))
    (match memo
      memo-val (print memo-val)
      0x
    )
    (ok true)
  )
)

;; Mint (owner only)
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (<= (+ (var-get total-minted) amount) MAX-SUPPLY) ERR-MINT-FAILED)
    (try! (ft-mint? bitvault-token amount recipient))
    (var-set total-minted (+ (var-get total-minted) amount))
    (ok true)
  )
)

;; Update token URI
(define-public (set-token-uri (new-uri (optional (string-utf8 256))))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (var-set token-uri new-uri)
    (ok true)
  )
)
