import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Icon,
  Input,
  List,
  Menu,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
  Tooltip,
} from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import numeral from 'numeral';
import router from 'umi/router';
import Result from './Result';
import { StateType } from './model';
import { BasicListItemDataType } from './data.d';
import styles from './style.less';
import { ListItemDataType } from '@/pages/list/search/applications/data';
import { formatWan } from '@/pages/list/search/applications';
import { downloadDetail } from './service';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

interface BasicListProps extends FormComponentProps {
  listBasicList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}
interface BasicListState {
  visible: boolean;
  done: boolean;
  current?: Partial<BasicListItemDataType>;
}
@connect(
  ({
    listBasicList,
    loading,
  }: {
    listBasicList: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    listBasicList,
    loading: loading.models.listBasicList,
  }),
)
class BasicList extends Component<BasicListProps, BasicListState> {
  state: BasicListState = { visible: false, done: false, current: undefined };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  addBtn: HTMLButtonElement | undefined | null = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listBasicList/fetch',
      payload: {
        count: 5,
      },
    });
  }

  onchange(e) {
    const { dispatch } = this.props;
    e.persist();
    const { value } = e.target;
    dispatch({
      type: 'listBasicList/filterList',
      payload: {
        id: value,
      },
    });
  }

  handleFormSubmit = (value: string) => {
    router.push(`/detail/${value}`);
  };

  download = (e, id) => {
    e.persist();
    downloadDetail(id).then(
      ({ data, response }) => {
        response.blob().then(blob => {
          const blobUrl = window.URL.createObjectURL(blob);
          const aLink = document.createElement('a'); // 创建a链接
          aLink.style.display = 'none';
          aLink.href = blobUrl;
          aLink.download = `${id}.txt`;
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
        });
      },
      err => {
        console.warn(err);
      },
    );
    e.stopPropagation();
  };

  render() {
    const {
      listBasicList: { searchList = [], maxLogId = '', uploadTs = '' },
      loading,
    } = this.props;

    const Info: React.SFC<{
      title: React.ReactNode;
      value: React.ReactNode;
      bordered?: boolean;
    }> = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const CardInfo: React.SFC<{
      env: React.ReactNode;
      ecif: React.ReactNode;
      nickname: React.ReactNode;
    }> = ({ env, ecif, nickname }) => (
      <div className={styles.cardInfo}>
        <div>
          <p>
            ecif: <span>{ecif}</span>
          </p>
        </div>
        <div>
          <p>
            环境: <span>{env}</span>
          </p>
        </div>
        <div>
          <p>
            昵称: <span>{nickname}</span>
          </p>
        </div>
      </div>
    );

    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <Input.Search
          placeholder="请输入日志id"
          enterButton="搜索"
          size="large"
          onSearch={this.handleFormSubmit}
          onChange={e => {
            this.onchange(e);
          }}
          style={{ maxWidth: 522, width: '100%' }}
        />
      </div>
    );
    return (
      <>
        <PageHeaderWrapper content={mainSearch}>
          <div className={styles.standardList}>
            <Card bordered={false}>
              <Row>
                <Col sm={12} xs={36}>
                  <Info
                    title="最新日志时间"
                    value={moment(uploadTs).format('YYYY-MM-DD HH:mm:ss')}
                    bordered
                  />
                </Col>
                <Col sm={12} xs={36}>
                  <Info title="日志总数" value={maxLogId} />
                </Col>
              </Row>
            </Card>
            <br />
            <List<BasicListItemDataType>
              rowKey="id"
              grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
              loading={loading}
              dataSource={searchList}
              renderItem={item => (
                <List.Item
                  key={item.id}
                  onClick={() => {
                    const key = `${item.id}`;
                    router.push(`/detail/${key}`);
                  }}
                >
                  <Card
                    headStyle={{}}
                    title={`id: ${item.id}`}
                    extra={
                      <Tooltip title="下载日志数据">
                        <Button
                          type="primary"
                          shape="circle"
                          icon="download"
                          ghost
                          onClick={e => {
                            this.download(e, item.id);
                          }}
                        />
                      </Tooltip>
                    }
                  >
                    <CardInfo ecif={item.ecif} env={item.env} nickname={item.nickname} />
                  </Card>
                </List.Item>
              )}
            />
          </div>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default Form.create<BasicListProps>()(BasicList);
