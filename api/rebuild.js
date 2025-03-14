// Force Vercel to rebuild the project by providing a unique response each time
module.exports = (req, res) => {
  const now = new Date();
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).json({
    rebuild: true,
    timestamp: now.toISOString(),
    message: 'This endpoint forces Vercel to rebuild the project'
  });
};