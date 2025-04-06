const bcrypt = require("bcryptjs");
const DB = require("../../../Database/Variable/DBVar");

module.exports = async (req, res) => {
    try {
        let InputEmail = req.body.Email; 
        let InputPassword = req.body.Password;
        const salt = bcrypt.genSaltSync(10); 

        if (!InputEmail || !InputPassword) { 
            return res.send("Please fill in all fields");
        }

        const User = await DB.Users.findOne({ attributes: ['id', 'Token', 'Password'] }, { where: { Email: InputEmail } });

        if (!User) {
            return res.send("Login Failed, User Not Found");
        }

        let CheckPass = bcrypt.compareSync(InputPassword, User.Password);

        if (CheckPass) {
            let NewToken = bcrypt.hashSync(InputEmail, salt);

            await User.update({ Token: NewToken });

            let ReturnData = {
                Id: User.id,
                Token: NewToken
            };

            return res.send(ReturnData);
        } else {
            return res.send("Login Failed, Incorrect Data");
        }
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).send("Internal Server Error");
    }
};
