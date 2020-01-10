import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Row, Col } from "antd";
import { openModal, closeModal } from "@/actions/modalActions";
import * as ModalContent from "@/constants/modalContent";
import { getDocumentDownloadToken } from "@/utils/actionlessNetworkCalls";
import { modalConfig } from "@/components/modalContent/config";
import CustomPropTypes from "@/customPropTypes";
import * as Permission from "@/constants/permissions";
import AuthorizationWrapper from "@/components/common/wrappers/AuthorizationWrapper";
import AddButton from "@/components/common/AddButton";
import {
  createNoticeOfWorkApplicationReview,
  fetchNoticeOfWorkApplicationReviews,
  deleteNoticeOfWorkApplicationReview,
  updateNoticeOfWorkApplicationReview,
} from "@/actionCreators/noticeOfWorkActionCreator";
import { fetchNoticeOfWorkApplicationReviewTypes } from "@/actionCreators/staticContentActionCreator";
import { getNoticeOfWorkReviews } from "@/selectors/noticeOfWorkSelectors";
import { getDropdownNoticeOfWorkApplicationReviewTypeOptions } from "@/selectors/staticContentSelectors";
import NOWApplicationReviewsTable from "@/components/noticeOfWork/applications/referals/NOWApplicationReviewsTable";

/**
 * @constant ReviewNOWApplication renders edit/view for the NoW Application review step
 */

const propTypes = {
  // eslint-disable-next-line
  noticeOfWorkGuid: PropTypes.string.isRequired,
  // eslint-disable-next-line
  noticeOfWorkReviews: PropTypes.arrayOf(CustomPropTypes.NOWApplicationReview).isRequired,
  applicationDocuments: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  submissionDocuments: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  noticeOfWorkReviewTypes: CustomPropTypes.options.isRequired,

  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  createNoticeOfWorkApplicationReview: PropTypes.func.isRequired,
  fetchNoticeOfWorkApplicationReviews: PropTypes.func.isRequired,
  fetchNoticeOfWorkApplicationReviewTypes: PropTypes.func.isRequired,
  deleteNoticeOfWorkApplicationReview: PropTypes.func.isRequired,
};

const defaultProps = {};

export class NOWApplicationReviews extends Component {
  componentDidMount() {
    this.props.fetchNoticeOfWorkApplicationReviews(this.props.noticeOfWorkGuid);
    this.props.fetchNoticeOfWorkApplicationReviewTypes();
  }

  handleAddReview = (values) => {
    this.props.createNoticeOfWorkApplicationReview(this.props.noticeOfWorkGuid, values).then(() => {
      this.props.fetchNoticeOfWorkApplicationReviews(this.props.noticeOfWorkGuid);
      this.props.closeModal();
    });
  };

  handleEditReview = (values) => {
    console.log(values);
    const { now_application_review_id } = values;
    const form_values = {
      documents: values.uploadedFiles,
      now_application_review_type_code: values.now_application_review_type_code,
      response_date: values.response_date,
      referee_name: values.referee_name,
    };
    this.props
      .updateNoticeOfWorkApplicationReview(
        this.props.noticeOfWorkGuid,
        now_application_review_id,
        form_values
      )
      .then(() => {
        this.props.fetchNoticeOfWorkApplicationReviews(this.props.noticeOfWorkGuid);
        this.props.closeModal();
      });
  };

  handleDeleteReview = (now_application_review_id) => {
    this.props
      .deleteNoticeOfWorkApplicationReview(this.props.noticeOfWorkGuid, now_application_review_id)
      .then(() => {
        this.props.fetchNoticeOfWorkApplicationReviews(this.props.noticeOfWorkGuid);
        this.props.closeModal();
      });
  };

  waitFor = (conditionFunction) => {
    const poll = (resolve) => {
      if (conditionFunction()) resolve();
      else setTimeout((_) => poll(resolve), 400);
    };

    return new Promise(poll);
  };

  downloadDocument = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "url";
    a.style.display = "none";
    document.body.append(a);
    console.log("clicking the link.");
    a.click();
    console.log("NEXT");
    a.remove();
  };

  openAddReviewModal = (event, onSubmit) => {
    event.preventDefault();
    const initialValues = { now_application_guid: this.props.noticeOfWorkGuid };
    this.props.openModal({
      props: {
        initialValues,
        onSubmit,
        title: "Add Review to Permit Application",
        review_types: this.props.noticeOfWorkReviewTypes,
      },
      isViewOnly: true,
      content: modalConfig.NOW_REVIEW,
    });
  };

  openEditReviewModal = (event, initialValues, onSubmit) => {
    event.preventDefault();
    console.log(initialValues);
    this.props.openModal({
      props: {
        initialValues,
        onSubmit,
        title: "Edit Review",
        review_types: this.props.noticeOfWorkReviewTypes,
      },
      isViewOnly: true,
      content: modalConfig.NOW_REVIEW,
    });
  };

  downloadDocumentPackage = (selectedRows) => {
    const docURLS = [];
    const documents = this.props.submissionDocuments
      .map((document) => ({
        key: document.id,
        filename: document.filename,
      }))
      .filter((item) => selectedRows.includes(item.key));

    for (const doc of documents) {
      getDocumentDownloadToken(doc.key, this.props.noticeOfWorkGuid, docURLS);
    }
    this.waitFor((_) => docURLS.length === documents.length).then(async () => {
      console.log(docURLS);
      for (const url of docURLS) {
        this.downloadDocument(url);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      this.props.closeModal();
    });
  };

  openDownloadPackageModal = (event) => {
    event.preventDefault();
    this.props.openModal({
      props: {
        noticeOfWorkGuid: this.props.noticeOfWorkGuid,
        submissionDocuments: this.props.submissionDocuments,
        onSubmit: this.downloadDocumentPackage,
        title: `Download Files`,
      },
      // widthSize: "50vw",
      content: modalConfig.DOWNLOAD_DOC_PACKAGE,
    });
  };

  render() {
    return (
      <div>
        <Row type="flex" justify="center">
          <Col sm={22} md={22} lg={22} className="padding-xxl--top">
            <Button
              type="secondary"
              className="full-mobile"
              onClick={this.openDownloadPackageModal}
            >
              Download Referral Package
            </Button>
            <AuthorizationWrapper permission={Permission.EDIT_PERMITS}>
              <AddButton onClick={(event) => this.openAddReviewModal(event, this.handleAddReview)}>
                Add Review
              </AddButton>
            </AuthorizationWrapper>
          </Col>
        </Row>

        <Row type="flex" justify="center">
          <Col sm={22} md={22} lg={22}>
            {this.props.noticeOfWorkReviews && (
              <NOWApplicationReviewsTable
                noticeOfWorkReviews={this.props.noticeOfWorkReviews}
                noticeOfWorkReviewTypes={this.props.noticeOfWorkReviewTypes}
                handleDelete={this.handleDeleteReview}
                openEditModal={this.openEditReviewModal}
                handleEdit={this.handleEditReview}
              />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  noticeOfWorkReviews: getNoticeOfWorkReviews(state),
  noticeOfWorkReviewTypes: getDropdownNoticeOfWorkApplicationReviewTypeOptions(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      openModal,
      closeModal,
      fetchNoticeOfWorkApplicationReviews,
      createNoticeOfWorkApplicationReview,
      fetchNoticeOfWorkApplicationReviewTypes,
      deleteNoticeOfWorkApplicationReview,
      updateNoticeOfWorkApplicationReview,
    },
    dispatch
  );

NOWApplicationReviews.propTypes = propTypes;
NOWApplicationReviews.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NOWApplicationReviews);
