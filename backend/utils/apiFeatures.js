class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", // case in-sensititve
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    const removeField = ["keyword", "page", "limit"];
    removeField.forEach((key) => delete queryCopy[key]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = JSON.parse(
      queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)
    );

    this.query = this.query.find(queryStr);
    return this;
  }

  pagination(productPerPage) {
    const currentPage = Number(this.queryStr.page) || 1; // 50 - 10

    const skip = productPerPage * (currentPage - 1);

    this.query = this.query.limit(productPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
