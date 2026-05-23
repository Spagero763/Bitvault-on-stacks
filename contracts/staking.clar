;; ============================================================================
;; BITVAULT - Staking Contract
;; ============================================================================
;; Lets BVT holders stake their governance tokens. Staked balances can be used
;; as voting weight and are the basis for future reward distribution.
;; ============================================================================

;; ---------------------------------------------------------------------------
;; Constants & Error Codes
;; ---------------------------------------------------------------------------
(define-constant ERR-NOT-AUTHORIZED (err u600))
(define-constant ERR-INVALID-AMOUNT (err u601))
(define-constant ERR-INSUFFICIENT-STAKE (err u602))
(define-constant ERR-TRANSFER-FAILED (err u603))

;; ---------------------------------------------------------------------------
;; Data
;; ---------------------------------------------------------------------------
(define-data-var total-staked uint u0)
(define-data-var staker-count uint u0)

(define-map stakes
  { staker: principal }
  {
    amount: uint,
    updated-at: uint,
  }
)

;; ---------------------------------------------------------------------------
;; Read-Only
;; ---------------------------------------------------------------------------

(define-read-only (get-stake (staker principal))
  (default-to { amount: u0, updated-at: u0 }
    (map-get? stakes { staker: staker })
  )
)

(define-read-only (get-staked-amount (staker principal))
  (get amount (get-stake staker))
)

(define-read-only (get-total-staked)
  (var-get total-staked)
)

(define-read-only (get-staker-count)
  (var-get staker-count)
)

(define-read-only (is-staking (staker principal))
  (> (get-staked-amount staker) u0)
)

;; ---------------------------------------------------------------------------
;; Public Functions
;; ---------------------------------------------------------------------------

;; Stake BVT tokens. Tokens are transferred from the caller to this contract.
(define-public (stake (amount uint))
  (let (
      (caller tx-sender)
      (current (get-stake caller))
      (was-staking (> (get amount current) u0))
    )
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (try! (contract-call? .governance-token transfer amount caller
      (as-contract tx-sender) none
    ))

    (map-set stakes { staker: caller } {
      amount: (+ (get amount current) amount),
      updated-at: stacks-block-height,
    })
    (var-set total-staked (+ (var-get total-staked) amount))
    (if was-staking
      true
      (var-set staker-count (+ (var-get staker-count) u1))
    )

    (print {
      event: "staked",
      staker: caller,
      amount: amount,
    })
    (ok true)
  )
)

;; Unstake BVT tokens. Tokens are returned from this contract to the caller.
(define-public (unstake (amount uint))
  (let (
      (staker tx-sender)
      (current (get-stake staker))
      (staked (get amount current))
    )
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (>= staked amount) ERR-INSUFFICIENT-STAKE)

    (try! (as-contract (contract-call? .governance-token transfer amount
      tx-sender staker none
    )))

    (map-set stakes { staker: staker } {
      amount: (- staked amount),
      updated-at: stacks-block-height,
    })
    (var-set total-staked (- (var-get total-staked) amount))
    (if (is-eq (- staked amount) u0)
      (var-set staker-count (- (var-get staker-count) u1))
      true
    )

    (print {
      event: "unstaked",
      staker: staker,
      amount: amount,
    })
    (ok true)
  )
)
