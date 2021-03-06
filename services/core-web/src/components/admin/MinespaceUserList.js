import React from "react";
import { Table, Button, Popconfirm, Icon } from "antd";
import PropTypes from "prop-types";
import CustomPropTypes from "@/customPropTypes";
import * as Strings from "@/constants/strings";
import NullScreen from "@/components/common/NullScreen";
import TableLoadingWrapper from "@/components/common/wrappers/TableLoadingWrapper";
import { getTableHeaders } from "@/utils/helpers";

const propTypes = {
  minespaceUsers: PropTypes.arrayOf(CustomPropTypes.minespaceUser),
  minespaceUserMines: PropTypes.arrayOf(CustomPropTypes.mineName),
  handleDelete: PropTypes.func,
  isLoaded: PropTypes.bool.isRequired,
};

const defaultProps = {
  minespaceUsers: [],
  minespaceUserMines: [],
  handleDelete: () => {},
};

const columns = [
  {
    title: "User Email",
    width: 150,
    dataIndex: "email",
    render: (text) => <div title="User Email">{text}</div>,
  },
  {
    title: "Mines",
    width: 150,
    dataIndex: "mineNames",
    render: (text) => (
      <div title="Mines">
        {text &&
          text.map(({ mine_guid, mine_name }) => (
            <span key={mine_guid}>
              {mine_name}
              <br />
            </span>
          ))}
      </div>
    ),
  },
  {
    title: "",
    width: 150,
    dataIndex: "delete",
    render: (text, record) => (
      <div title="">
        <Popconfirm
          placement="topLeft"
          title={`Are you sure you want to delete ${record.email}?`}
          onConfirm={() => text(record.user_id)}
          okText="Delete"
          cancelText="Cancel"
        >
          <Button className="full-mobile" ghost type="primary">
            <Icon type="minus-circle" theme="outlined" />
          </Button>
        </Popconfirm>
      </div>
    ),
  },
];

const lookupMineName = (mine_guids, mines) =>
  mine_guids.map((mine_guid) => {
    const mine_record = mines.find((mine) => mine.mine_guid === mine_guid);
    return {
      mine_guid,
      mine_name: mine_record ? `${mine_record.mine_name}-${mine_record.mine_no}` : "",
    };
  });

const transformRowData = (minespaceUsers, mines, deleteFunc) =>
  minespaceUsers.map((user) => ({
    key: user.user_id,
    emptyField: Strings.EMPTY_FIELD,
    email: user.email,
    mineNames: lookupMineName(user.mines, mines),
    user_id: user.user_id,
    delete: deleteFunc,
  }));

export const MinespaceUserList = (props) => (
  <TableLoadingWrapper condition={props.isLoaded} tableHeaders={getTableHeaders(columns)}>
    <Table
      rowClassName="fade-in"
      align="center"
      pagination={false}
      columns={columns}
      dataSource={transformRowData(
        props.minespaceUsers,
        props.minespaceUserMines,
        props.handleDelete
      )}
      locale={{ emptyText: <NullScreen type="no-results" /> }}
    />
  </TableLoadingWrapper>
);
MinespaceUserList.propTypes = propTypes;
MinespaceUserList.defaultProps = defaultProps;

export default MinespaceUserList;
