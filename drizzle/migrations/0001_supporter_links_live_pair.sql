ALTER TABLE supporter_links ADD COLUMN IF NOT EXISTS liveKey VARCHAR(100) NULL;

UPDATE supporter_links
SET liveKey = CONCAT(supporterId, ':', memberId)
WHERE status IN ('pending', 'active') AND liveKey IS NULL;

CREATE UNIQUE INDEX supporter_links_live_pair_idx ON supporter_links (liveKey);

