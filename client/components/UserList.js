import React from 'react';
import { connect } from 'react-redux';
import { getUsers } from '../store/users';
import UserInfo from './UserInfo';

class UserList extends React.Component {
	constructor() {
		super();
	}

	componentDidMount() {
		this.props.getUsers();
	}

	render() {
		const { users, updateUserType } = this.props;

		return (
			<div className="users-container">
				<div id="user-list">
					<div className="header">Users</div>
					<table>
						<tbody>
							<tr>
								<th>Username</th>
								<th>Email</th>
								<th>Role</th>
								<th>Remove User</th>
							</tr>
							{users.map((user) => (
								<UserInfo
									user={user}
									key={user.id}
									updateUserType={updateUserType}
								/>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

const mapState = ({ users }) => {
	return {
		users,
	};
};

const mapDispatch = (dispatch) => {
	return {
		getUsers: () => dispatch(getUsers()),
	};
};

export default connect(mapState, mapDispatch)(UserList);
