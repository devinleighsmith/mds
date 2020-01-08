ALTER TABLE now_application
    ADD COLUMN lead_inspector_party_guid uuid;

ALTER TABLE now_application
    ADD CONSTRAINT now_application_party_lead_inspector_fkey
    FOREIGN KEY (lead_inspector_party_guid) REFERENCES party(party_guid) ON UPDATE CASCADE ON DELETE SET NULL;