COMMENT ON TABLE address											IS 'Contains a list of party addresses, which are further linked to a party record in the party_address_xref table.';
COMMENT ON TABLE mine_incident										IS 'A list of incidents that have occured on a given mine including; incidents, dangerous occurances, and loss of life';
COMMENT ON TABLE mine_incident_document_type_code					IS 'A lookup table of document types being submitted as part of a mine incident record; i.e. Initial Document, Final Document.';
COMMENT ON TABLE mine_incident_document_xref						IS 'Contains the references to the one or many documents that have been attached to a mine incident record.';
COMMENT ON TABLE mine_party_appt									IS 'Contains a list of organizations and people (parties) that are associated with a mine and how they are associated with the mine. This table includes references to the party''s ''appointment'' to the mine (i.e. Mine Manager, Engineer of Record, Permittee), the dates their appointment was active, and (where applicable) which permit or tailings storage facility a particular party is associated with.';
COMMENT ON TABLE mine_party_appt_type_code							IS 'A lookup table of party appointments, or roles, that a person or organization can be assigned to a mine; i.e. Mine Manager, Permittee, Mine Operator, Engineer of Record, Fire Boss, etc.';
COMMENT ON TABLE mine_region_code									IS 'A lookup table of Mine Regions; i.e. South West, North West.';
COMMENT ON TABLE mine_report_definition_compliance_article_xref		IS 'Defines the sections of the HSRC that are applied to a mine report definition. This needed to  determine which Mine Reports a mine is required to submit as the HSRC is applicable to the mine''s permit conditions.';
COMMENT ON TABLE mine_verified_status								IS 'To aid the assurance of a mine''s data quality, this table is used to show whether or not the mine is verified to be correct (such as mine name, associated parties, etc.). This is determined by EMPR staff and a flag is set within the Core application.';
COMMENT ON TABLE party_type_code									IS 'A lookup table used to categorize party records; i.e. Person, Organization.';
COMMENT ON TABLE permit												IS 'Contains basic permit details for a specific mine.';
COMMENT ON TABLE permit_amendment									IS 'Contains the details of the initial permit record as well as a history of each amendment made to a permit over time. Amendments may include extension of a permit, a change in permit status, or an amalgamation of permits.';
COMMENT ON TABLE permit_amendment_document							IS 'Reference to any documents recorded as part of a permit.';
COMMENT ON TABLE permit_amendment_status_code						IS 'A lookup table of statuses used to reflect the state of a permit amendment; i.e. Active, Remitted.';
COMMENT ON TABLE permit_amendment_type_code							IS 'A lookup table of possible types of permit amendments; i.e. Original Permit, Permit Amendment, Amalgamated Permit.';
COMMENT ON TABLE permit_status_code									IS 'A lookup table of permit statuses; i.e. Open, Closed.';
COMMENT ON TABLE variance_document_xref								IS 'Contains the references to the one or many documents that have been attached to a variance record.';
COMMENT ON TABLE mine												IS 'This table defines a unique record for each mine that exists in British Columbia. A mine is defined as an area where activities for exploration or production of coal, mineral bearing substances, placer minerals, rock, limestone, earth, clay, sand or gravel, is occuring or has occurred.';
