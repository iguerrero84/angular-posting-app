const express = require('express');

const PostController = require('../controllers/post');

const checkAuth = require("../middleware/check-auh");
const extractFile = require('../middleware/file-storage');

const router = express.Router();

router.post("", checkAuth, extractFile, PostController.createPost);

router.put("/:id", checkAuth, extractFile, PostController.updatePost);

router.get("", PostController.getPosts);

router.get("/:id", PostController.getPost);

router.delete("/:id", checkAuth, PostController.deletePost);


module.exports = router;
