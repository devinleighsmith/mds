-- Permits were transformed into permit amendments with a parent permit table. Update the ETL_PERMIT table with references to the parent permit record.
DO $$                  
    BEGIN 
        IF EXISTS
            ( SELECT 1
              FROM   information_schema.tables 
              WHERE  table_schema = 'public'
              AND    table_name = 'etl_permit'
            )
        then
	        IF NOT EXISTS
	            ( SELECT column_name 
					FROM information_schema.columns 
					WHERE table_name='etl_permit' and column_name='permit_amendment_guid'
	            )
	        THEN
				ALTER TABLE IF EXISTS ETL_PERMIT RENAME COLUMN permit_guid TO permit_amendment_guid;
				ALTER TABLE IF EXISTS ETL_PERMIT ADD COLUMN permit_guid uuid;
	        END IF ;
	       
			update etl_permit set permit_guid = 
			(select p.permit_guid from permit p join permit_amendment pa on p.permit_id=pa.permit_id where etl_permit.permit_amendment_guid=pa.permit_amendment_guid limit 1)
			where permit_guid is null;
        END IF ;
    END
   $$ ;
   