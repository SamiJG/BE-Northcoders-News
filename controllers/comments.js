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
  const voteUpOrDown = req.query.vote;
  if (voteUpOrDown === 'up') amount = 1;
  if (voteUpOrDown === 'down') amount = -1;
  let update = { $inc: { votes: amount } };
  Comment.findByIdAndUpdate(comment_id, update, { new: true })
    .populate('created_by', 'username')
    .populate('belongs_to', 'title')
    .then(comment => res.send(comment))
    .catch(next);
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params;
  Comment.findByIdAndRemove(comment_id)
    .populate('created_by', 'username')
    .populate('belongs_to', 'title')
    .then(deletedComment =>
      res.send({ msg: 'Your comment has been deleted', deletedComment })
    );
}

module.exports = { getAllComments, voteOnComment, deleteComment };
