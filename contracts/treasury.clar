;; ============================================================================
;; BITVAULT - Treasury Contract
;; ============================================================================
;; Manages vault funds: STX deposits, proposal-gated withdrawals,
;; and transaction history.
;; ============================================================================

(define-constant ERR-NOT-AUTHORIZED (err u500))
(define-constant ERR-VAULT-NOT-FOUND (err u501))
(define-constant ERR-PROPOSAL-NOT-FOUND (err u502))
(define-constant ERR-INSUFFICIENT-FUNDS (err u503))
(define-constant ERR-TRANSFER-FAILED (err u504))
(define-constant ERR-PROPOSAL-NOT-EXECUTABLE (err u505))
(define-constant ERR-WRONG-PROPOSAL-TYPE (err u506))
(define-constant ERR-INVALID-AMOUNT (err u507))
(define-constant ERR-DEPOSIT-FAILED (err u508))

(define-constant TYPE-TRANSFER u1)

;; ---------------------------------------------------------------------------
;; Data Maps
;; ---------------------------------------------------------------------------

(define-map vault-balances
  { vault-id: uint }
  { stx-balance: uint }
)

(define-map transactions
  { vault-id: uint, tx-id: uint }
  {
    tx-type: (string-ascii 16),
    amount: uint,
    sender: principal,
    recipient: principal,
    proposal-id: uint,
    block: uint
  }
)

(define-map vault-tx-count
  { vault-id: uint }
  { count: uint }
)

;; ---------------------------------------------------------------------------
;; Read-Only
;; ---------------------------------------------------------------------------

(define-read-only (get-vault-balance (vault-id uint))
  (default-to
    { stx-balance: u0 }
    (map-get? vault-balances { vault-id: vault-id })
  )
)

(define-read-only (get-stx-balance (vault-id uint))
  (get stx-balance (get-vault-balance vault-id))
)

(define-read-only (get-transaction (vault-id uint) (tx-id uint))
  (map-get? transactions { vault-id: vault-id, tx-id: tx-id })
)

(define-read-only (get-tx-count (vault-id uint))
  (get count (default-to { count: u0 } (map-get? vault-tx-count { vault-id: vault-id })))
)

;; ---------------------------------------------------------------------------
;; Public Functions
;; ---------------------------------------------------------------------------

;; Deposit STX into a vault
(define-public (deposit-stx (vault-id uint) (amount uint))
  (let
    (
      (vault (unwrap! (contract-call? .multisig-vault get-vault vault-id) ERR-VAULT-NOT-FOUND))
      (current-balance (get-vault-balance vault-id))
      (caller tx-sender)
      (tx-count (get-tx-count vault-id))
    )
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)

    (unwrap! (stx-transfer? amount caller (as-contract tx-sender)) ERR-DEPOSIT-FAILED)

    (map-set vault-balances
      { vault-id: vault-id }
      { stx-balance: (+ (get stx-balance current-balance) amount) }
    )

    (map-set transactions
      { vault-id: vault-id, tx-id: tx-count }
      {
        tx-type: "deposit",
        amount: amount,
        sender: caller,
        recipient: (as-contract tx-sender),
        proposal-id: u0,
        block: stacks-block-height
      }
    )

    (map-set vault-tx-count
      { vault-id: vault-id }
      { count: (+ tx-count u1) }
    )

    (ok true)
  )
)

;; Execute a transfer proposal
(define-public (execute-transfer (proposal-id uint))
  (let
    (
      (proposal (unwrap! (contract-call? .proposal-engine get-proposal proposal-id) ERR-PROPOSAL-NOT-FOUND))
      (vault-id (get vault-id proposal))
      (amount (get target-amount proposal))
      (recipient (unwrap! (get target-principal proposal) ERR-NOT-AUTHORIZED))
      (current-balance (get-vault-balance vault-id))
      (caller tx-sender)
      (tx-count (get-tx-count vault-id))
    )
    (asserts! (contract-call? .multisig-vault is-member vault-id caller) ERR-NOT-AUTHORIZED)
    (asserts! (is-eq (get proposal-type proposal) TYPE-TRANSFER) ERR-WRONG-PROPOSAL-TYPE)
    (asserts! (contract-call? .proposal-engine is-proposal-executable proposal-id) ERR-PROPOSAL-NOT-EXECUTABLE)
    (asserts! (>= (get stx-balance current-balance) amount) ERR-INSUFFICIENT-FUNDS)

    (unwrap! (as-contract (stx-transfer? amount tx-sender recipient)) ERR-TRANSFER-FAILED)

    (map-set vault-balances
      { vault-id: vault-id }
      { stx-balance: (- (get stx-balance current-balance) amount) }
    )

    (map-set transactions
      { vault-id: vault-id, tx-id: tx-count }
      {
        tx-type: "withdrawal",
        amount: amount,
        sender: (as-contract tx-sender),
        recipient: recipient,
        proposal-id: proposal-id,
        block: stacks-block-height
      }
    )

    (map-set vault-tx-count
      { vault-id: vault-id }
      { count: (+ tx-count u1) }
    )

    (try! (contract-call? .proposal-engine mark-executed proposal-id))

    (ok true)
  )
)

;; Emergency withdrawal (vault owner only)
(define-public (emergency-withdraw (vault-id uint) (amount uint) (recipient principal))
  (let
    (
      (vault (unwrap! (contract-call? .multisig-vault get-vault vault-id) ERR-VAULT-NOT-FOUND))
      (current-balance (get-vault-balance vault-id))
      (caller tx-sender)
    )
    (asserts! (contract-call? .multisig-vault is-vault-owner vault-id caller) ERR-NOT-AUTHORIZED)
    (asserts! (>= (get stx-balance current-balance) amount) ERR-INSUFFICIENT-FUNDS)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)

    (unwrap! (as-contract (stx-transfer? amount tx-sender recipient)) ERR-TRANSFER-FAILED)

    (map-set vault-balances
      { vault-id: vault-id }
      { stx-balance: (- (get stx-balance current-balance) amount) }
    )

    (ok true)
  )
)
