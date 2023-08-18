const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const passport = require('passport')

const User = require('../service/schemas/user')

require('dotenv').config()

const SECRET = process.env.SECRET

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: SECRET,
}

passport.use(
	new JwtStrategy(opts, (payload, done) => {
		User.findOne({ _id: payload.id })
			.then(user => {
				if (!user) {
					return done(new Error('User not found'))
				}
				return done(null, user)
			})
			.catch(err => done(err))
	})
)

const auth = (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user) => {
		const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
		if (!user || !token || user.token !== token || err) {
			return res.status(401).json({
				status: 'error',
				code: 401,
				message: 'Not authorized',
			})
		}
		req.user = user
		next()
	})(req, res, next)
}

module.exports = auth
