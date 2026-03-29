import {
  createQuestionPaper,
  getQuestionPapers,
} from "../services/questionPaper.service.js";

export const uploadQuestionPaper = async (req, res, next) => {
  try {
    const result = await createQuestionPaper({
      body: req.body,
      file: req.file,
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      url: result.fileUrl,
      paper: result.paper,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadQuestionPapers = async (req, res, next) => {
  try {
    const result = await getQuestionPapers(req.query);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
