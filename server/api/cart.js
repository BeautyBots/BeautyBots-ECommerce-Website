const cartRouter = require('express').Router();
const {
	models: { User, Order, LineItem },
} = require('../db');
module.exports = cartRouter;

//GET /api/cart
cartRouter.get('/', async (req, res, next) => {
	try {
		const user = await User.findByToken(req.headers.authorization);
		res.send(await user.getCart());
	} catch (err) {
		next(err);
	}
});

//POST /api/cart (ONLY IF CART IS EMPTY AND GUEST LOGS IN)
cartRouter.post('/', async (req, res, next) => {
	try {
		const user = await User.findByToken(req.headers.authorization);
		const order = await Order.findOne({
			where: { userId: user.id, status: 'Cart' },
		});
		req.body.lineItems.forEach((lineItem) => {
			LineItem.create({ ...lineItem, orderId: order.id });
		});
		res.send(await user.getCart());
	} catch (err) {
		next(err);
	}
});

//POST /api/cart/createOrder FOR AUTH USERS
cartRouter.post('/createOrder', async (req, res, next) => {
	try {
		const user = await User.findByToken(req.headers.authorization);
		const emptyCart = await user.createOrder();
		res.send(emptyCart)
	} catch (error) {
		next(error);
	}
});

//POST/api/cart/createOrderGuest FOR GUESTS
cartRouter.post('/createOrderGuest', async (req, res, next) => {
	try {
		const order = await Order.create(req.body);
		res.send(order);
		const lineItems = req.body.lineItems;
		lineItems.forEach(async (item) => {
			//this next line sets orderId to the id found in the newly created Order instance
			item.orderId = order.id;
			await LineItem.create(item);
		});
	} catch (error) {
		next(error);
	}
});

//POST /api/cart/addToCart
cartRouter.post('/addToCart', async (req, res, next) => {
	try {
		const user = await User.findByToken(req.headers.authorization);
		res.send(await user.addToCart(req.body));
	} catch (err) {
		next(err);
	}
});

//POST /api/cart/removeFromCart
cartRouter.post('/removeFromCart', async (req, res, next) => {
	try {
		const user = await User.findByToken(req.headers.authorization);
		res.send(await user.removeFromCart(req.body));
	} catch (err) {
		next(err);
	}
});

//DELETE /api/cart/removeProduct
cartRouter.delete('/removeProduct/:productId', async (req, res, next) => {
	try {
		const user = await User.findByToken(req.headers.authorization);
		res.send(await user.removeProduct({ productId: req.params.productId }));
	} catch (err) {
		next(err);
	}
});
