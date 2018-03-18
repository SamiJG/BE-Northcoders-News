const { Comment } = require('../models');

function getAllComments(req, res, next) {
  Comment.find()
    .populate('created_by', 'username')
    .populate('belongs_to', 'title')
    .then(comments => res.send({ comments }))
    .catch(next);
}

function voteOnComment(req, res, next) {
  const { comment_id } = req.params;
  const vote = req.query.vote;
  if (vote !== 'up' && vote !== 'down' && vote !== undefined)
    return next({
      status: 400,
      msg: 'Unable to vote, please check your query selection'
    });
  if (vote) {
    if (vote === 'up') value = 1;
    if (vote === 'down') value = -1;
    Comment.findByIdAndUpdate(
      comment_id,
      { $inc: { votes: value } },
      { new: true }
    )
      .populate('created_by', 'username')
      .populate('belongs_to', 'title')
      .then(comment => res.send(comment))
      .catch(err => {
        if (err.name === 'CastError')
          return next({
            status: 400,
            msg: 'Unable to vote: Comment does not exist',
            err
          });
        next(err);
      });
  }
  return next({ status: 404 });
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params;
  Comment.findByIdAndRemove(comment_id)
    .populate('created_by', 'username')
    .populate('belongs_to', 'title')
    .then(deletedComment =>
      res.send({ msg: 'Your comment has been deleted', deletedComment })
    )
    .catch(err => {
      if (err.name === 'CastError')
        return next({
          status: 400,
          msg: 'Unable to delete: Comment does not exist',
          err
        });
      next(err);
    });
}

module.exports = { getAllComments, voteOnComment, deleteComment };
