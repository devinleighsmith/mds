// <label> is being used as is to replicate ant design structure of other rendered fields but,
// this causes a linting error. Disabling this rule for this file as jsx structure does not allow
// disabling it on the specific line.
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm, FieldArray } from "redux-form";
import { Form, Col, Row, Icon } from "antd";
import * as FORM from "@/constants/forms";
import CustomPropTypes from "@/customPropTypes";
import { renderConfig } from "@/components/common/config";
import { required, dateNotInFuture } from "@/utils/Validate";
import LinkButton from "@/components/common/LinkButton";
import FileUpload from "@/components/common/FileUpload";
import { MINE_INCIDENT_DOCUMENT } from "@/constants/API";
import { IncidentsUploadedFilesList } from "@/components/Forms/incidents/IncidentsUploadedFilesList";
import * as Strings from "@/constants/strings";

const propTypes = {
  followupActionOptions: CustomPropTypes.options.isRequired,
  incidentStatusCodeOptions: CustomPropTypes.options.isRequired,
  hasFatalities: PropTypes.bool.isRequired,
  determinationTypeCode: PropTypes.string.isRequired,
  mineGuid: PropTypes.string.isRequired,
  hasFollowUp: PropTypes.bool.isRequired,
  uploadedFiles: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  onFileLoad: PropTypes.func.isRequired,
  onRemoveFile: PropTypes.func.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.any).isRequired,
};

const renderRecommendations = ({ fields }) => [
  <div className="ant-col ant-form-item-label">
    <label>Recommendations</label>
  </div>,
  fields.map((recommendation) => (
    <Field
      name={`${recommendation}.recommendation`}
      placeholder="Provide recommendation actions"
      component={renderConfig.AUTO_SIZE_FIELD}
    />
  )),
  <LinkButton onClick={() => fields.push({})}>
    <Icon type="plus" className="padding-small--right padding-large--bottom" />
    {fields.length ? `Add another recommendation` : `Add a recommendation`}
  </LinkButton>,
];

export class AddIncidentFollowUpForm extends Component {
  isHistoricalIncident =
    this.props.initialValues.followup_investigation_type_code ===
    Strings.INCIDENT_FOLLOWUP_ACTIONS.unknown;

  uncommonBehaviourWarning = () =>
    this.props.determinationTypeCode === Strings.INCIDENT_DETERMINATION_TYPES.pending &&
    this.props.hasFollowUp
      ? "Warning: It's uncommon for an inspection to occur if a determination has not been made"
      : undefined;

  filteredFollowupActions = () =>
    this.props.followupActionOptions.filter(
      ({ value }) =>
        this.isHistoricalIncident || value !== Strings.INCIDENT_FOLLOWUP_ACTIONS.unknown
    );

  render() {
    return (
      <div>
        <Form layout="vertical">
          <Row gutter={48}>
            <Col>
              <h4>Follow-up Information</h4>

              {!this.props.hasFatalities && (
                <Form.Item>
                  <Field
                    id="followup_inspection"
                    name="followup_inspection"
                    label="Was there a follow-up inspection?"
                    component={renderConfig.RADIO}
                    onChange={this.onFollowUpChange}
                    validate={[required]}
                  />
                </Form.Item>
              )}

              {this.props.hasFollowUp && (
                <Form.Item>
                  <Field
                    id="followup_inspection_date"
                    name="followup_inspection_date"
                    label="Follow-up inspection date"
                    placeholder="Please select date"
                    component={renderConfig.DATE}
                    validate={[dateNotInFuture, this.uncommonBehaviourWarning]}
                  />
                </Form.Item>
              )}
              <Form.Item>
                <Field
                  id="followup_investigation_type_code"
                  name="followup_investigation_type_code"
                  label="Was it escalated to EMPR investigation?*"
                  placeholder="Please choose one"
                  component={renderConfig.SELECT}
                  data={this.filteredFollowupActions()}
                  validate={[required]}
                />
              </Form.Item>

              <h4>Final Investigation Report</h4>
              {!this.props.hasFatalities && (
                <FieldArray
                  id="recommendations"
                  name="recommendations"
                  component={renderRecommendations}
                />
              )}

              {this.props.uploadedFiles.length > 0 && (
                <Form.Item label="Attached files" style={{ paddingBottom: "10px" }}>
                  <Field
                    id="initial_documents"
                    name="initial_documents"
                    component={IncidentsUploadedFilesList}
                    files={this.props.uploadedFiles}
                    onRemoveFile={this.props.onRemoveFile}
                  />
                </Form.Item>
              )}
              <Form.Item>
                <Field
                  id="InitialIncidentFileUpload"
                  name="InitialIncidentFileUpload"
                  onFileLoad={(document_name, document_manager_guid) =>
                    this.props.onFileLoad(
                      document_name,
                      document_manager_guid,
                      Strings.INCIDENT_DOCUMENT_TYPES.final
                    )
                  }
                  uploadUrl={MINE_INCIDENT_DOCUMENT(this.props.mineGuid)}
                  component={FileUpload}
                />
              </Form.Item>

              <Form.Item>
                <Field
                  id="status_code"
                  name="status_code"
                  label="Incident status*"
                  component={renderConfig.SELECT}
                  data={this.props.incidentStatusCodeOptions}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

AddIncidentFollowUpForm.propTypes = propTypes;

export default reduxForm({
  form: FORM.MINE_INCIDENT,
  destroyOnUnmount: false,
  touchOnBlur: true,
  forceUnregisterOnUnmount: true,
})(AddIncidentFollowUpForm);
