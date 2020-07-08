const PostModel = require('../models/post');


exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const postModel = new PostModel({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  postModel.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  })
   .catch(error => {
     res.status(500).json({
         message: "Failure creating a post!"
     });
   });
}

exports.getPosts = (req, res, next) => {
  const pageSize =  +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = PostModel.find();
  let fetchedPosts;
  if (pageSize && currentPage){
    postQuery
       .skip(pageSize * (currentPage - 1 ))
       .limit(pageSize);
  }
  postQuery.find().then( documents  => {
     fetchedPosts = documents;
     return PostModel.count();
  })
  .then(count => {
     res.status(200).json({
       message: 'Posts fetched susccessfully!!',
       posts: fetchedPosts,
       maxPosts: count
     });
  })
   .catch(error => {
     res.status(500).json({
       message: "Failure fetching posts!"
   });
 });
}

exports.getPost = (req, res, next) => {
  PostModel.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Failure fetching the post!"
  });
 });
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new PostModel({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });

  PostModel.updateOne({
    _id: req.params.id,
    creator: req.userData.userId
  }, post).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "Not authorized for this update!" });
    }
  })
   .catch(error => {
     res.status(500).json({
       message: "Couldn't update post!"
     });
   });
}

exports.deletePost = (req, res, next) => {
  PostModel.deleteOne({ _id: req.params.id,  creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Post deleted successfully!" });
      } else {
        res.status(401).json({ message: "Not authorized for deleting" });
      }
   })
   .catch(error => {
    res.status(500).json({
      message: "Failure deleting post!"
    });
  });
}
