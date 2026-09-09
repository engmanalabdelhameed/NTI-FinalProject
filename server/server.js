const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const reviewsFile = path.join(__dirname, 'reviews.json');

app.get('/api/reviews', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
  res.json(reviews);
});

app.get('/', (req, res) => {
  res.send('Book Store API is running');
});



//Post review

app.post('/api/reviews', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));

  const newReview = {
    id: reviews.length + 1,
    ...req.body
  };

  reviews.push(newReview);

  fs.writeFileSync(
    reviewsFile,
    JSON.stringify(reviews, null, 2)
  );

  res.status(201).json(newReview);
});

//Wishlist

const wishlistFile = path.join(__dirname, 'wishlist.json');

app.get('/api/wishlist', (req, res) => {
  const wishlist = JSON.parse(fs.readFileSync(wishlistFile, 'utf8'));
  res.json(wishlist);
});

app.post('/api/wishlist', (req, res) => {
  const wishlist = JSON.parse(fs.readFileSync(wishlistFile, 'utf8'));

  const { userId, bookId } = req.body;

  let userWishlist = wishlist.find(
    item => item.userId === userId
  );

  if (!userWishlist) {
    userWishlist = {
      userId: userId,
      bookIds: []
    };

    wishlist.push(userWishlist);
  }

  if (!userWishlist.bookIds.includes(bookId)) {
    userWishlist.bookIds.push(bookId);
  }

  fs.writeFileSync(
    wishlistFile,
    JSON.stringify(wishlist, null, 2)
  );

  res.status(201).json(userWishlist);
});

app.delete('/api/wishlist/:userId/:bookId', (req, res) => {
  const wishlist = JSON.parse(fs.readFileSync(wishlistFile, 'utf8'));

  const userId = Number(req.params.userId);
  const bookId = Number(req.params.bookId);

  const userWishlist = wishlist.find(
    item => item.userId === userId
  );

  if (userWishlist) {
    userWishlist.bookIds = userWishlist.bookIds.filter(
      id => id !== bookId
    );
  }

  fs.writeFileSync(
    wishlistFile,
    JSON.stringify(wishlist, null, 2)
  );

  res.json(userWishlist);
});

app.delete('/api/wishlist/:userId', (req, res) => {
  const wishlist = JSON.parse(fs.readFileSync(wishlistFile, 'utf8'));

  const userId = Number(req.params.userId);

  const userWishlist = wishlist.find(
    item => item.userId === userId
  );

  if (userWishlist) {
    userWishlist.bookIds = [];
  }

  fs.writeFileSync(
    wishlistFile,
    JSON.stringify(wishlist, null, 2)
  );

  res.json(userWishlist);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});