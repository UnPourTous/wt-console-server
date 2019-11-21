import { Badge, Card, Descriptions, Divider, Table } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { BasicProfileDataType } from './data.d';
import styles from './style.less';
import { StateType } from './model';

interface BasicProps {
  loading: boolean;
  dispatch: Dispatch<any>;
  basicInfo: BasicProfileDataType;
}
interface BasicState {
  visible: boolean;
}

@connect(
  ({
    profileBasic,
    loading,
  }: {
    profileBasic: BasicProfileDataType;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    profileBasic,
    loading: loading.effects['profileBasic/fetchBasic'],
  }),
)
class Basic extends Component<BasicProps, BasicState> {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'profileBasic/fetchBasic',
      payload: id,
    });
  }

  render() {
    const {
      profileBasic: { basicInfo = {} },
      loading,
    } = this.props;
    const { ecif, env, logList = [], meta = {}, nickname } = basicInfo;

    const renderContent = (value: any, row: any, index: any) => {
      const obj: {
        children: any;
        props: { colSpan?: number };
      } = {
        children: value,
        props: {},
      };
      if (index === basicInfo.length) {
        obj.props.colSpan = 0;
      }
      return obj;
    };
    const goodsColumns = [
      {
        title: '商品编号',
        dataIndex: 'id',
        key: 'id',
        render: (text: React.ReactNode, row: any, index: number) => {
          if (index < logList.length) {
            return <a href="">{text}</a>;
          }
          return {
            children: <span style={{ fontWeight: 600 }}>总计</span>,
            props: {
              colSpan: 4,
            },
          };
        },
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        render: renderContent,
      },
      {
        title: '商品条码',
        dataIndex: 'barcode',
        key: 'barcode',
        render: renderContent,
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        align: 'right' as 'left' | 'right' | 'center',
        render: renderContent,
      },
      {
        title: '数量（件）',
        dataIndex: 'num',
        key: 'num',
        align: 'right' as 'left' | 'right' | 'center',
        render: (text: any, row: any, index: number) => {
          if (index < basicInfo.length) {
            return text;
          }
          return <span style={{ fontWeight: 600 }}>{text}</span>;
        },
      },
      {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right' as 'left' | 'right' | 'center',
        render: (text: any, row: any, index: number) => {
          if (index < logList.length) {
            return text;
          }
          return <span style={{ fontWeight: 600 }}>{text}</span>;
        },
      },
    ];
    const progressColumns = [
      {
        title: '时间',
        width: '15%',
        render: (item: any, row: any, index: number) => (
          <span style={{ fontWeight: 600 }}>{moment(item.ts).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
      },
      {
        title: '类型',
        width: '10%',
        render: (item: string) => {
          if (item.logType === 'warn') {
            return <Badge status="warning" text="警告" />;
          }
          if (item.logType === 'error') {
            return <Badge status="error" text="错误" />;
          }
          return <Badge status="processing" text="日志" />;
        },
      },

      {
        title: '详情',
        width: '75%',
        render: (item: any, row: any, index: number) => (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all', fontWeight: 600 }}>
            {JSON.stringify(item.msg)}
          </div>
        ),
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Descriptions title="日志信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="日志id">{meta.id}</Descriptions.Item>
            <Descriptions.Item label="上传时间">
              {moment(meta.uploadTs).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="开发环境">{env}</Descriptions.Item>
            <Descriptions.Item label="ecif">{ecif}</Descriptions.Item>
            <Descriptions.Item label="昵称">{nickname}</Descriptions.Item>
          </Descriptions>

          <Divider style={{ marginBottom: 32 }} />

          <div className={styles.title}>日志详情</div>
          <Table
            rowKey="uid"
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={loading}
            dataSource={logList}
            columns={progressColumns}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Basic;
