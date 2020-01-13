import React from "react";
import { shallow } from "enzyme";
import { DownloadDocumentPackageModal } from "@/components/modalContent/DownloadDocumentPackageModal";

const dispatchProps = {};
const props = {};

const setupDispatchProps = () => {
  dispatchProps.onSubmit = jest.fn();
};

const setupProps = () => {
  props.title = "mockTitle";
  props.submissionDocuments = [];
  props.coreDocuments = [];
  props.mineGuid = "";
  props.noticeOfWorkGuid = "";
};

beforeEach(() => {
  setupDispatchProps();
  setupProps();
});

describe("DownloadDocumentPackageModal", () => {
  it("renders properly", () => {
    const component = shallow(<DownloadDocumentPackageModal {...dispatchProps} {...props} />);
    expect(component).toMatchSnapshot();
  });
});
