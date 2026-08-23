CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  actorUserId BIGINT NOT NULL,
  action VARCHAR(64) NOT NULL,
  targetType VARCHAR(64) NOT NULL,
  targetId BIGINT NULL,
  outcome VARCHAR(32) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX admin_audit_logs_actor_idx (actorUserId),
  INDEX admin_audit_logs_action_idx (action),
  INDEX admin_audit_logs_createdAt_idx (createdAt)
);
