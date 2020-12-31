/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
import { store } from 'react-notifications-component';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Alert,
  Col,
  UncontrolledAlert
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";
import "./index.css";

import Header from "components/Headers/Header.js";
import HomeModal from "./examples/ModalHome";
import { getAllItem } from "../domain";
import axios from "axios";
import MakeRequest from "./MakeRequest";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      isMouseOver: [],
      displayModal: false,
      activeNav: 1,
      chartExample1Data: "data1",
      dataSearch: '',
      alertVisible: false
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }
  async componentDidMount() {
    this.getData()
  }
  handleSearch = async (inputSearch) => {
    // await this.setState({
    //   ...this.state,
    //   listData: []
    // })
    const searchData = {
      searchData: inputSearch
    }
    const res = await MakeRequest("GET", "http://103.142.26.130:6001/item/search", searchData)
    // console.log('res:', res)
    if (res.data.code === 0) {
      console.log('code ngu')
      await this.setState({
        ...this.state,
        listData: res.data.data
      })
    }
  }

  getData = async () => {
    //console.log(getAllItem);
    const data = await MakeRequest("GET", getAllItem)
    const res = data.data
    //console.log("8666   ", res);

    if (res.code === 0 && res.message === "ok") {
      await this.setState({
        ...this.state,
        listData: res.data
      })
    }
  }

  handleMouseOver = async (isMouseOver, idx) => {
    for (let index = 0; index < this.state.listData.length; index++) {
      isMouseOver[index] = false
      if (index === idx) {
        isMouseOver[index] = true
      }
    }
    await this.setState({
      ...this.state,
      isMouseOver: isMouseOver
    })
    //console.log(this.state.isMouseOver);
  }
  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
      chartExample1Data:
        this.state.chartExample1Data === "data1" ? "data2" : "data1",
    });
  };
  render() {
    var isMouseOver = this.state.isMouseOver
    isMouseOver.length = this.state.listData.length
    //console.log(this.state.listData);
    return (
      <>
        <Header />
        <Container className=" mt--7" fluid>
          <Row>
            <div className=" col">
              <Card className=" shadow">
                <FormGroup style={{ display: 'flex', alignSelf: 'center' }}>
                  <Input
                    style={{ width: '500px' }}
                    type="search"
                    name="searchData"
                    id="exampleSearch"
                    placeholder="Tìm kiếm"
                    onChange={(data) => {
                      this.handleSearch(data.target.value)
                    }}
                  />
                  <Button>
                    <i class="fas fa-search"></i></Button>
                </FormGroup>
                <CardBody>
                  <Row className=" icon-examples">
                    <div
                      className="gridContainer">
                      {
                        this.state.listData.map((item, idx) => {
                          return (
                            <div
                              style={{ width: 200, marginLeft: 10, marginBottom: 15, alignItems: 'center' }}
                              onMouseEnter={() => this.handleMouseOver(isMouseOver, idx)}
                              className="item">
                              <div>
                                <img

                                  alt="..."
                                  className=" img-fluid rounded shadow"
                                  src={item?.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaJHHovVO36rCgZDgAad5hchXWr1ZSil8bfw&usqp=CAU'}
                                  style={{ width: 200 }}  >
                                </img>
                                {
                                  (this.state.isMouseOver[idx]) ? (< HomeModal data={item} />
                                  ) : ('')
                                }
                              </div>
                              <div
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                              >
                                <Button
                                  onClick={() => {
                                    //console.log('ok')
                                    store.addNotification({
                                      title: "Thông báo",
                                      message: "Đã thêm: " + item.name,
                                      type: "success",
                                      insert: "top",
                                      container: "bottom-left",
                                      animationOut: ["animate__animated animate__fadeOut"],
                                      dismiss: {
                                        duration: 2000,

                                      }
                                    });
                                  }}
                                  style={{ marginTop: 10, marginLeft: 10, width: '90%', marginBottom: 5 }} outline color="primary">Thêm vào giỏ hàng</Button>
                                <h3 style={{ color: 'red', fontWeight: 'bold' }}>({item.price} VND)</h3>
                                <p style={{ marginTop: -5, fontWeight: 'normal' }}>{item.name}</p>

                              </div>
                            </div>)
                        })}
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Index;
