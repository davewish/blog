
const blogModel = require("../Models/BlogSchema");

const getAllBlogs= async(req, res)=> {
    
  
      let perPage = 10;
      let page = req.query.page || 1;
  
      // Calculate the number of pages and check for the next page
      const totalBlogs = await blogModel.countDocuments();
      const totalPages = Math.ceil(totalBlogs / perPage);
      const hasNextPage = page < totalPages;
  
      // Query for the blog data, sort by createdAt, and apply pagination
      const data = await blogModel
        .find()
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage);
  
      return  {data ,page, totalPages, hasNextPage}
}

const getBlogById= async (id)=> {
  try {
    const blog = await blogModel.findById(id);
    return blog
  }
  catch(err) {
    console.log(err)
  }
  

}


module.exports= {
    getAllBlogs,
    getBlogById
}