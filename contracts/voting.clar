;; ============================================================================
;; BITVAULT - Voting Contract
;; ============================================================================
;; Vote casting, tallying, and quorum checks for proposals.
;; ============================================================================

(define-constant ERR-NOT-AUTHORIZED (err u400))
(define-constant ERR-VAULT-NOT-FOUND (err u401))
(define-constant ERR-PROPOSAL-NOT-FOUND (err u402))
(define-constant ERR-ALREADY-VOTED (err u403))
(define-constant ERR-VOTING-CLOSED (err u404))
(define-constant ERR-NOT-MEMBER (err u405))
(define-constant ERR-PROPOSAL-NOT-ACTIVE (err u406))

;; ---------------------------------------------------------------------------
;; Data Maps
;; ---------------------------------------------------------------------------

(define-map vote-weights
  {
    vault-id: uint,
    voter: principal,
  }
  { weight: uint }
)

(define-map vote-stats
  { proposal-id: uint }
  {
    total-yes: uint,
    total-no: uint,
    total-voters: uint,
    finalized: bool,
  }
)

;; Tracks which voters have already voted on each proposal
(define-map voter-record
  {
    proposal-id: uint,
    voter: principal,
  }
  { voted: bool }
)

;; ---------------------------------------------------------------------------
;; Read-Only
;; ---------------------------------------------------------------------------

(define-read-only (get-vote-stats (proposal-id uint))
  (default-to {
    total-yes: u0,
    total-no: u0,
    total-voters: u0,
    finalized: false,
  }
    (map-get? vote-stats { proposal-id: proposal-id })
  )
)

(define-read-only (get-vote-weight
    (vault-id uint)
    (voter principal)
  )
  (default-to { weight: u1 }
    (map-get? vote-weights {
      vault-id: vault-id,
      voter: voter,
    })
  )
)

(define-read-only (has-voter-voted
    (proposal-id uint)
    (voter principal)
  )
  (default-to false
    (get voted
      (map-get? voter-record {
        proposal-id: proposal-id,
        voter: voter,
      })
    ))
)

;; ---------------------------------------------------------------------------
;; Public Functions
;; ---------------------------------------------------------------------------

(define-public (cast-vote
    (proposal-id uint)
    (vote bool)
  )
  (let (
      (caller tx-sender)
      (proposal (unwrap! (contract-call? .proposal-engine get-proposal proposal-id)
        ERR-PROPOSAL-NOT-FOUND
      ))
      (vault-id (get vault-id proposal))
      (current-stats (get-vote-stats proposal-id))
      (voter-weight (get weight (get-vote-weight vault-id caller)))
    )
    (asserts! (contract-call? .multisig-vault is-member vault-id caller)
      ERR-NOT-MEMBER
    )
    (asserts! (contract-call? .proposal-engine is-proposal-active proposal-id)
      ERR-VOTING-CLOSED
    )
    (asserts! (not (has-voter-voted proposal-id caller)) ERR-ALREADY-VOTED)

    ;; Record vote to prevent double-voting
    (map-set voter-record {
      proposal-id: proposal-id,
      voter: caller,
    } { voted: true }
    )

    (map-set vote-stats { proposal-id: proposal-id } {
      total-yes: (if vote
        (+ (get total-yes current-stats) voter-weight)
        (get total-yes current-stats)
      ),
      total-no: (if (not vote)
        (+ (get total-no current-stats) voter-weight)
        (get total-no current-stats)
      ),
      total-voters: (+ (get total-voters current-stats) u1),
      finalized: false,
    })

    (ok true)
  )
)

(define-public (set-vote-weight
    (vault-id uint)
    (voter principal)
    (weight uint)
  )
  (let ((caller tx-sender))
    (asserts! (contract-call? .multisig-vault is-vault-owner vault-id caller)
      ERR-NOT-AUTHORIZED
    )
    (asserts! (contract-call? .multisig-vault is-member vault-id voter)
      ERR-NOT-MEMBER
    )

    (map-set vote-weights {
      vault-id: vault-id,
      voter: voter,
    } { weight: weight }
    )

    (ok true)
  )
)

(define-public (finalize-votes (proposal-id uint))
  (let ((stats (get-vote-stats proposal-id)))
    (asserts! (not (get finalized stats)) ERR-VOTING-CLOSED)

    (map-set vote-stats { proposal-id: proposal-id }
      (merge stats { finalized: true })
    )

    (contract-call? .proposal-engine finalize-proposal proposal-id)
  )
)
