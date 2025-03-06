-- Function to count comments for a list of rating IDs
CREATE OR REPLACE FUNCTION get_comment_counts(rating_ids UUID[])
RETURNS TABLE (rating_id UUID, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT bc.rating_id, COUNT(bc.id)::BIGINT
  FROM bean_comments bc
  WHERE bc.rating_id = ANY(rating_ids)
  GROUP BY bc.rating_id;
END;
$$ LANGUAGE plpgsql; 