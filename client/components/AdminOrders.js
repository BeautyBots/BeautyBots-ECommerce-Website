import React from "react";
import { connect } from "react-redux";
import { getAdminOrders } from "../store/adminOrders";
import AdminOrderInfo from "./AdminOrderInfo";
import { Table } from "react-bootstrap";

class AdminOrders extends React.Component {
  constructor() {
    super();
    this.state = {
      sort: "status",
      filter: "none",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.getOrders();
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.sort !== this.state.sort ||
      prevState.filter !== this.state.filter
    ) {
      this.props.getOrders();
    }
  }

  render() {
    let orders = this.props.orders || [];

    //sort orders
    if (this.state.sort === "status") {
      orders = orders.sort((a, b) => a.status.localeCompare(b.status));
    } else {
      orders = orders.sort((a, b) =>
        a.user.username.localeCompare(b.user.username)
      );
    }

    //filter orders
    if (this.state.filter === "pending") {
      orders = orders.filter((order) => order.status === "Pending");
    } else if (this.state.filter === "shipped") {
      orders = orders.filter((order) => order.status === "Shipped");
    }

    return (
      <div id="admin-orders">
        <h2 className="text-center">All Orders</h2>
				<div className="admin-orders-filter">
					<label>
						Sort By:
						<select
							name="sort"
							value={this.state.sort}
							onChange={this.handleChange}
						>
							<option value="status">Status</option>
							<option value="user">Users (A-Z)</option>
						</select>
					</label>

					<label>
						Filter By:
						<select
							name="filter"
							value={this.state.filter}
							onChange={this.handleChange}
						>
							<option value="none">None</option>
							<option value="pending">Pending Orders</option>
							<option value="shipped">Shipped Orders</option>
						</select>
					</label>
				</div>

        <Table striped bordered hover className="all-orders-table text-center">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Status</th>
              <th>Customer</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <AdminOrderInfo order={order} key={order.id} />
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    orders: state.adminOrders,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getOrders: () => dispatch(getAdminOrders()),
  };
};

export default connect(mapState, mapDispatch)(AdminOrders);
