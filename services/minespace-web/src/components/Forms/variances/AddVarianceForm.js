import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm, change } from "redux-form";
import { remove } from "lodash";
import { Form, Button, Popconfirm } from "antd";
import * as FORM from "@/constants/forms";
import { renderConfig } from "@/components/common/config";
import { required, maxLength } from "@/utils/Validate";
import { resetForm } from "@/utils/helpers";
import CustomPropTypes from "@/customPropTypes";
import VarianceFileUpload from "@/components/Forms/variances/VarianceFileUpload";

const propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  mineGuid: PropTypes.string.isRequired,
  complianceCodes: CustomPropTypes.options.isRequired,
};

export class AddVarianceForm extends Component {
  state = {
    uploadedFiles: [],
    documentNameGuidMap: {},
  };

  onFileLoad = (documentName, document_manager_guid) => {
    this.state.uploadedFiles.push({ documentName, document_manager_guid });
    this.setState(({ documentNameGuidMap }) => ({
      documentNameGuidMap: {
        [document_manager_guid]: documentName,
        ...documentNameGuidMap,
      },
    }));
    change("uploadedFiles", this.state.uploadedFiles);
  };

  onRemoveFile = (fileItem) => {
    remove(this.state.documentNameGuidMap, { document_manager_guid: fileItem.serverId });
    change("uploadedFiles", this.state.uploadedFiles);
  };

  render() {
    return (
      <Form
        layout="vertical"
        onSubmit={this.props.handleSubmit(this.props.onSubmit(this.state.documentNameGuidMap))}
      >
        <Field
          id="compliance_article_id"
          name="compliance_article_id"
          label="Part of Code*"
          placeholder="Select a part of the code"
          component={renderConfig.SELECT}
          validate={[required]}
          data={this.props.complianceCodes}
        />

        <Field
          id="note"
          name="note"
          label="Description"
          component={renderConfig.AUTO_SIZE_FIELD}
          validate={[maxLength(300)]}
        />

        <Form.Item label="Attached Files">
          <p>Please upload all the required documents here for the variance application.</p>
          <Field
            id="uploadedFiles"
            name="uploadedFiles"
            onFileLoad={this.onFileLoad}
            onRemoveFile={this.onRemoveFile}
            mineGuid={this.props.mineGuid}
            component={VarianceFileUpload}
          />
        </Form.Item>
        <div className="right center-mobile">
          <Popconfirm
            placement="topRight"
            title="Are you sure you want to cancel?"
            onConfirm={this.props.closeModal}
            okText="Yes"
            cancelText="No"
          >
            <Button className="full-mobile" type="secondary">
              Cancel
            </Button>
          </Popconfirm>
          <Button
            className="full-mobile"
            type="primary"
            htmlType="submit"
            disabled={this.props.submitting}
          >
            Submit
          </Button>
        </div>
      </Form>
    );
  }
}

AddVarianceForm.propTypes = propTypes;

export default reduxForm({
  form: FORM.ADD_VARIANCE,
  touchOnBlur: false,
  onSubmitSuccess: resetForm(FORM.ADD_VARIANCE),
})(AddVarianceForm);
