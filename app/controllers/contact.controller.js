const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = (req, res) => {
    res.send({ 
        message: "create handler"
    });
};

exports.findAll = (req, res) => {
    res.send({
        message: "findAll handler"
    });
};

exports.findOne = (req, res) => {
    res.send({
        message: "findOne handler"
    });
};

exports.update = (req, res) => {
    res.send({
        message: "update handler"
    });
};

exports.delete = (req, res) => {
    res.send({
        message: "delete handler"
    });
};

exports.deleteAll = (req, res) => {
    res.send({
        message: "deleteAll handler"
    });
};

exports.findAllFavorite = (req, res) => {
    res.send({
        message: "findAllFavorite handler"
    });
};

exports.handleLogin = (req, res) => {
    res.send({
        message: "login handler"
    });
}

// create and save a new contact
exports.create = async (req, res, next) => {
    if (!req.body.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    } catch (error) {
        // console.log('Loi:' + error);
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};

// retrieve all contacts of a user form the database
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const contactService = new ContactService(MongoDB.client);
        let name = req.body.name;
        // const { name } = req.query;
        if (name) {
            documents = await contactService.findByName(name);
        } else {
            documents = await contactService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occured while retrieving contacts")
        );
    }

    return res.send(documents);
}

// find a single contact with an id
exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving contact with id=${req.params.id}`)
        );
    }
};

// update a contact by the id in the request
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was updated successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Error updating contact with id=${req.params.id}`)
        );
    }
}
// delete a contact with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was deleted successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete contact with id=${req.params.id}`)
        )
    };
};

// find all favorite contacts of a user
exports.findAllFavorite = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.findFavorite();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving favorite contacts")
        );
    }
};

// delete all contacts of a user from the database
exports.deleteAll = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        return res.send({
            message: `${deletedCount} contacts were deleted successfully`,
        });
    } catch (error) {
        return next(new ApiError(500, "An error occurred while removing all contacts"));
    }
};

// mo rong login
exports.handleLogin = async (req, res, next) => {
    let documents = [];
    try {
        const contactService = new ContactService(MongoDB.client);
        let email = req.body.email;
        if (email) {
            documents = await contactService.login(email);
            if (documents.length == 0) {
                return next(new ApiError(404, `Your email doesn't exist in our system, please try another email`));
            }
            return res.send(documents);
        } else {
            return next(new ApiError(404, `Email can not be empty`));
        }
    } catch (error) {
        return next(new ApiError(500, "An error occurred while logging"));
    }
}