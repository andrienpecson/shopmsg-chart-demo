"use strict";
import * as React from "react";
import { Layout, Menu, Breadcrumb, Icon, Card, Switch, Row, Col } from "antd";
import axios from "axios";
import { chain, without, findIndex } from "underscore";
// Stateless Components
import DateRangePicker from "./globalComponents/dateRangePicker";
import LineChart from "./globalComponents/lineChart";
import Loading from "./globalComponents/loading";

import { openNotification } from "../global-function";

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

// Interfaces
interface Props { }

interface ChartData {
  label: string,
  fill: boolean,
  borderColor: string,
  backgroundColor: string,
  lineTension: number,
  data: Array<number>
}

interface DatasetObj {
  type: string,
  chart_data: ChartData
}

interface State {
  collapsed: boolean;
  loading: boolean;
  chart_labels: Array<string>;
  chart_datasets: Array<DatasetObj>;
  filters: Array<string>;
};

require("antd/dist/antd.less");

export default class DashboardApp extends React.Component<Props, State> {
  state: State = {
    collapsed: false,
    loading: false,
    chart_labels: [],
    chart_datasets: [],
    filters: ["optins", "recipients"]
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }

  handleChangeDate = (values) => {
    if (values.length > 0) {
      this.setState({ loading: true }, () => this.fetchData(values))
    }
  }

  handleChange = ({ type, value }) => {
    const { filters } = { ...this.state };
    const updatedFilter = (value == false) ? without(filters, type) : [...filters, type];
    this.setState({ filters: updatedFilter });
  }


  fetchData = async (params) => {
    const selectedDates = (params).map((date) => { return date.format("YYYY-MM-DD") });
    // Fetching of data based on the selected date range.
    // For the request URL I append https://cors-anywhere.herokuapp.com/ just to override the CORS header issue with Heroku server. 
    const optins = new Promise(async (resolve, reject) => {
      const optinsReqURL = `${"https://cors-anywhere.herokuapp.com/"}https://shopmsg-chart-demo.herokuapp.com/api/reports/optins.json?from=${selectedDates[0]}&to=${selectedDates[1]}`;
      axios
        .get(optinsReqURL).then(({ data }) => {
          resolve(
            {
              type: "optins",
              chart_data: {
                label: "Optins",
                data: (data).map(({ count }) => { return count }),
                fill: false,
                borderColor: "#65bdff",
                backgroundColor: "#65bdff",
                lineTension: 0
              },
              label: (data).map(({ date }) => { return date })
            }
          )
        }).catch((err) => {
          reject(err)
        })
    });
    const recipients = new Promise(async (resolve, reject) => {
      const recipientsReqURL = `${"https://cors-anywhere.herokuapp.com/"}https://shopmsg-chart-demo.herokuapp.com/api/reports/recipients.json?from=${selectedDates[0]}&to=${selectedDates[1]}`;
      axios
        .get(recipientsReqURL).then(({ data }) => {
          resolve({
            type: "recipients",
            chart_data: {
              label: "Recipients",
              data: (data).map(({ count }) => { return count }),
              fill: false,
              borderColor: "#f75262",
              backgroundColor: "#f75262",
              lineTension: 0
            },
            label: (data).map(({ date }) => { return date })
          })
        }).catch((err) => {
          reject(err)
        })
    });
    // Preparation of data for the line chart.
    try {
      const fetchResult = await Promise.all([optins, recipients]);
      const chartLabels = chain(fetchResult)
        .map(({ label }) => { return label })
        .flatten()
        .uniq()
        .value();
      const chartData = (fetchResult).map(({ chart_data, type }) => { return { chart_data, type } });

      this.setState({
        loading: false,
        chart_labels: chartLabels,
        chart_datasets: chartData
      }, () => openNotification({
        type: "success",
        title: "Success",
        description: "Data successfully retrieved."
      }))
    } catch (e) {
      this.setState({
        loading: false
      }, () => openNotification({
        type: "error",
        title: "Error",
        description: "Something went wrong. Please try again."
      }));
    }
  }

  renderLineChart = () => {
    const {
      chart_datasets,
      chart_labels,
      filters
    } = { ...this.state };

    const dataSet = chain(chart_datasets)
      .filter(({ type }) => {
        return findIndex(filters, (o) => { return o == type }) >= 0
      })
      .map(({ chart_data }) => { return chart_data })
      .value();
    return (<LineChart data={dataSet} labels={chart_labels} />)
  }

  render() {
    const { loading, collapsed } = { ...this.state };

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="1">
              <Icon type="pie-chart" />
              <span>Reports</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="desktop" />
              <span>Option 2</span>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={<span><Icon type="user" /><span>User</span></span>}
            >
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={<span><Icon type="team" /><span>Team</span></span>}
            >
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9">
              <Icon type="file" />
              <span>File</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }} />
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Reports</Breadcrumb.Item>
              <Breadcrumb.Item>Message Receipts & Optins</Breadcrumb.Item>
            </Breadcrumb>
            <Card style={{ marginBottom: 20 }}>
              <Row type="flex" align="middle" style={{ marginBottom: 20 }}>
                <Col xs={24} sm={8} lg={4}>
                  <p style={{ margin: 0, fontSize: 16, textAlign: "right" }}>Date Range:</p>
                </Col>
                <Col xs={24} sm={{ span: 14, offset: 1 }} lg={{ span: 6, offset: 1 }}>
                  <DateRangePicker onChange={this.handleChangeDate} />
                </Col>
              </Row>
              <Row type="flex" align="middle" style={{ marginBottom: 20 }}>
                <Col xs={12} sm={8} lg={4}>
                  <p style={{ margin: 0, fontSize: 16, textAlign: "right" }}>Show Optins:</p>
                </Col>
                <Col xs={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 1 }}>
                  <Switch defaultChecked onChange={e => this.handleChange({ type: "optins", value: e })} />
                </Col>
              </Row>
              <Row type="flex" align="middle" style={{ marginBottom: 20 }}>
                <Col xs={12} sm={8} lg={4}>
                  <p style={{ margin: 0, fontSize: 16, textAlign: "right" }}>Show Recipients:</p>
                </Col>
                <Col xs={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 1 }}>
                  <Switch defaultChecked onChange={e => this.handleChange({ type: "recipients", value: e })} />
                </Col>
              </Row>
            </Card>
            <Card>
              {
                (loading) && <Loading />
              }
              {
                this.renderLineChart()
              }
            </Card>
          </Content>
          <Footer style={{ textAlign: "center" }}>ShopMessage ©2018</Footer>
        </Layout>
      </Layout>
    );
  }
}