const bcrypt = require("bcryptjs");
const DB = require("../../../Database/Variable/DBVar");

module.exports = async (req, res) => {
    try {
        let InputEmail = req.body.Email; 
        let InputPassword = req.body.Password;

        if (!InputEmail || !InputPassword) {
            return res.status(400).send("Please fill in all fields");
        }

        const User = await DB.Users.findOne({
            attributes: ['id', 'Token', 'Password'],
            where: { Email: InputEmail }
        });

        if (!User) {
            return res.status(404).send("Login Failed, User Not Found");
        }

        let CheckPass = await bcrypt.compare(InputPassword, User.Password);

        if (CheckPass) {
            const salt = bcrypt.genSaltSync(10); 
            let NewToken = bcrypt.hashSync(InputEmail, salt);

            DB.Users.update({ Token: NewToken }, { where: { id: User.id } });
            let HaveStore = await DB.Stores.findOne({where: {StoreIdOwner: User.id}});

            let ReturnData = {
                Id: User.id,
                Token: NewToken,
                HaveStore: HaveStore
            };

            return res.status(200).send(ReturnData);
        } else {
            return res.status(401).send("Login Failed, Incorrect Password");
        }
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).send("Internal Server Error");
    }
};
