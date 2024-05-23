import Transaction from '../models/transaction.model.js'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'

export default {

	Mutation: {
		signup: async (_, { input }, context) => {
			try {
				const { username, password, name, gender } = input
				console.log(input)
				if (!username || !password || !name || !gender) throw new Error("All fields are required!");
				const existingUser = await User.findOne({ username })

				if (existingUser) throw new Error('User already Exist!');
				const hashedPassword = await bcrypt.hash(password, 10)
				const profilePicture = (gender == 'male' ? `https://avatar.iran.liara.run/public/boy?username=${username}` : `https://avatar.iran.liara.run/public/girl?username=${username}`)
				const newUser = await User.create({ username, password: hashedPassword, name, gender, profilePicture })
				await context.login(newUser)
				return newUser
			} catch (error) {
				throw new Error(error.message || "Internal server error!")
			}
		},

		login: async (_, { input }, context) => {
			const { username, password } = input
			const { user } = await context.authenticate('graphql-local', { username, password })

			await context.login(user)
			return user
		},

		logout: async (_, __, context) => {
			try {
				await context.logout();
				context.req.session.destroy((err) => {
					if (err) throw err;
				});
				context.res.clearCookie("connect.sid");

				return { message: "Logged out successfully" };
			} catch (err) {
				console.error("Error in logout:", err);
				throw new Error(err.message || "Internal server error");
			}
		},
	},

	Query: {
		authUser: async (_, __, context) => {
			try {
				// const user = await context.getUser();
				let user = {
					_id: '4234234',
					name: "Mohammed Sajidul ",
					username: "shajid",
					password: 'fasdf',
					profilePicture: 'fsdf',
					gender: 'male',
					transactions: []
				}
				return user;
			} catch (err) {
				console.error("Error in authUser: ", err);
				throw new Error("Internal server error");
			}
		},
		getUser: async (_, { userId }) => {
			try {
				const user = await User.findById(userId);
				return user;
			} catch (err) {
				console.error("Error in user query:", err);
				throw new Error(err.message || "Error getting user");
			}
		},
	},

	User: {
		transactions: async (parent) => {
			try {
				const transactions = await Transaction.find({ userId: parent._id });
				return transactions;
			} catch (err) {
				console.log("Error in user.transactions resolver: ", err);
				throw new Error(err.message || "Internal server error");
			}
		},
	},
}