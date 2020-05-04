const path = require('path')
const fs = require('fs')
const { validationResult } = require('express-validator/check')
const postModel = require('../models/post')


exports.getPost = (req, res, next) => {
  postModel.find()
    .then(posts => {
      res.status(200).json({ message: 'Fetched posts successfully.', posts: posts })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err);
    })

}




exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.files[0]) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.files[0].path;
  const title = req.body.title;
  const content = req.body.content;
  const post = new postModel({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: 'Maximilian' }
  });
  post
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Post created successfully!',
        post: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};





// exports.createPost = (req, res, next) => {
//   const errors = validationResult(req)
//   if (!errors.isEmpty()) {
//     const error = new Error('validation failed, enterd data is incorrect')
//     error.statusCode = 422;
//     throw error // we used the throw error here to send that error to the catch block to used the global middleware in app.js 
//   }
//   if (!req.file) {
//     const error = new Error('No image provided');
//     error.statusCode = 422;
//     throw error;
//   }

//   const title = req.body.title;
//   const content = req.body.content
//   const imageUrl = req.file.path
//   const post = new postModel({
//     title: title,
//     content: content,
//     imageUrl: imageUrl,
//     creator: {
//       name: 'ahmed hossam'
//     },
//   });
//   post.save()
//     .then(result => {
//       res.status(201).json({
//         message: 'Post Created Successfully ',
//         post: {
//           post: result
//         }
//       })
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500
//       }
//       next(err);
//     });
// }

exports.getSinglePost = (req, res, next) => {
  const postId = req.params.postId
  postModel.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('could not find post.')
        error.statusCode = 404
        throw error // we used the (throw error ) insted next(error) here to send that error to the catch block to used the global middleware in app.js 
      }
      res.status(200).json({ message: 'post fetched', post: post })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err);
    })
}

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId
  // use error validation 
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('validation failed, enterd data is incorrect')
    error.statusCode = 422;
    throw error // we used the throw error here to send that error to the catch block to used the global middleware in app.js 
  }
  // step 1) => extract new data from body 
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  // check if new file added store new path on imageUrl 
  if (req.file) {
    imageUrl = req.file.path;
  }
  // check if no path catched 
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }

  // step 2) => find and  updated data in database
  postModel.findById(postId)
    .then(post => {
      // check if not post find 
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      // check if new image pathed i will delete old image 
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      // path new data to catched post
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Post updated!', post: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err);
    }).catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

}

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};






