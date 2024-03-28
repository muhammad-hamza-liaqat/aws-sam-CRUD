// import StatusCodes from "http-status-codes";
// import carModel from "./car.model.mjs";
// import {
//   HTTPError,
//   HTTPResponse,
//   DBConn,
//   catchError,
//   authToken,
// } from "./utils/helper.mjs";

// export const handler = async (event) => {
//   try {
//     await DBConn();
//     const method = event.httpMethod;
//     const path = event.path;
//     const pathParams = event.pathParameters;
//     const body = event.body;
//     const queryParams = event.queryStringParameters || {};

//     switch (method) {
//       case "GET":
//         if (path === "/getAllCars") {
//           return await getAllCars(queryParams);
//         } else if (
//           path.startsWith("/getCarById/") &&
//           pathParams &&
//           pathParams.id
//         ) {
//           return await getCarById(pathParams.id);
//         }
//         break;
//       case "POST":
//         if (path === "/addCars") {
//           return await addCars(body, imageData);
//         }
//         break;
//       case "PUT":
//         if (path.startsWith("/updateCar/") && pathParams && pathParams.id) {
//           return await updateCar(pathParams.id, body);
//         }
//         break;
//       case "DELETE":
//         if (path.startsWith("/deleteCar/") && pathParams && pathParams.id) {
//           return await deleteCar(pathParams.id);
//         }
//         break;
//       default:
//         return {
//           statusCode: StatusCodes.METHOD_NOT_ALLOWED,
//           body: JSON.stringify({
//             message: "Endpoint not allowed",
//           }),
//         };
//     }
//   } catch (error) {
//     console.error("An error occurred:", error);
//     return {
//       statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//       body: JSON.stringify({ message: "Something Went Wrong", error: error }),
//     };
//   }
// };

// const getAllCars = async (queryParams) => {
//   try {
//     const page = Number(queryParams.page) || 1;
//     const limit = Number(queryParams.limit) || 10;
//     const skip = (page - 1) * limit;
//     const carData = await carModel.find({}).skip(skip).limit(limit);
//     const totalCarCount = await carModel.countDocuments();
//     return {
//       statusCode: StatusCodes.OK,
//       body: JSON.stringify({
//         message: "cars fetched successfully",
//         data: carData,
//         totalCarCount: totalCarCount,
//         currentPage: page,
//         totalPages: Math.ceil(totalCarCount / limit),
//       }),
//     };
//   } catch (error) {
//     console.error("An error occurred:", error);
//     return {
//       statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//       body: JSON.stringify({ message: "Something Went Wrong", error: error }),
//     };
//   }
// };

// const getCarById = async (carId) => {
//   try {
//     if (!carId) {
//       return {
//         statusCode: StatusCodes.BAD_REQUEST,
//         body: JSON.stringify({
//           error: "Invalid car ID provided",
//         }),
//       };
//     }
//     const car = await carModel.findById(carId);
//     if (!chain) {
//       return {
//         statusCode: StatusCodes.NOT_FOUND,
//         body: JSON.stringify({
//           error: " car not found",
//         }),
//       };
//     }
//     return {
//       statusCode: StatusCodes.OK,
//       body: JSON.stringify({
//         message: "SuccessFuly fetched cars",
//         data: chain,
//       }),
//     };
//   } catch (error) {
//     console.error("An error occurred:", error);
//     return {
//       statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//       body: JSON.stringify({ message: "Something Went Wrong", error: error }),
//     };
//   }
// };

// export const addCars = async (requestBody, image) => {
//   try {
//     const requestData = JSON.parse(requestBody);
//     // await chainSchema.validate(requestData, { abortEarly: false });
//     const { carName, Make, Model, Variant, Price, imported  } = requestData;
//     let chain = await Chain.findOne({ name });
//     // if (chain) {
//     //   let error = new HTTPError(
//     //     "A chain with the provided name already exists",
//     //     StatusCodes.CONFLICT
//     //   );
//     //   return {
//     //     statusCode: StatusCodes.CONFLICT,
//     //     body: JSON.stringify(error),
//     //   };
//     // }
//     // if (image) {
//     //   const baseURL = `http://localhost:5000/uploads/chainImage/${image.name}`;
//     //   const imageUrl = await uploadFile(image.data, baseURL);
//     //   requestData.image = imageUrl;
//     // }
//     carNew = new carModel(requestData);
//     await carNew.save();
//     let response = new HTTPResponse("car created successfully", chain);
//     return {
//       statusCode: StatusCodes.CREATED,
//       body: JSON.stringify(response),
//     };
//   } catch (error) {
//     return await catchError(error);
//   }
// };

// const updateCar = async (carId, requestBody) => {
//   try {
//     const requestData = JSON.parse(requestBody);
//     // await chainSchema.validate(requestData, { abortEarly: false });

//     // if (requestData.name) {
//     //   const existingChain = await Chain.findOne({
//     //     name: requestData.name,
//     //     _id: { $ne: chainId },
//     //   });
//     //   if (existingChain) {
//     //     const response = new HTTPError(
//     //       "A chain with the provided name already exists",
//     //       StatusCodes.CONFLICT
//     //     );
//     //     return {
//     //       statusCode: StatusCodes.CONFLICT,
//     //       body: JSON.stringify(response),
//     //     };
//     //   }
//     // };
//     // if (image) {
//     //   const baseURL = `http://localhost:3000/uploads/chainImage/${image.name}`;
//     //   const imageUrl = await uploadFile(image.data, baseURL);
//     //   requestData.image = imageUrl;
//     // }
//     const updatedCar = await carModel.findOneAndUpdate(
//       { _id: carId },
//       requestData,
//       {
//         new: true,
//       }
//     );
//     if (updateCar) {
//       const successResponse = {
//         message: "car updated successfully",
//         data: updateCar,
//       };
//       return {
//         statusCode: StatusCodes.OK,
//         body: JSON.stringify(successResponse),
//       };
//     } else {
//       const response = new HTTPError(
//         "No car found with the provided ID",
//         StatusCodes.NOT_FOUND
//       );
//       return {
//         statusCode: StatusCodes.NOT_FOUND,
//         body: JSON.stringify(response),
//       };
//     }
//   } catch (error) {
//     return await catchError(error);
//   }
// };

// const deleteCar = async (carID) => {
//   try {
//     if (!carID) {
//       return {
//         statusCode: StatusCodes.BAD_REQUEST,
//         body: JSON.stringify({
//           error: "Invalid chain ID provided",
//         }),
//       };
//     }
//     const deletedCar = await carModel.findOneAndDelete({
//       _id: carID,
//     });
//     if (deletedCar) {
//       const successResponse = {
//         message: "car successfully deleted",
//         data: deletedCar,
//       };
//       return {
//         statusCode: StatusCodes.OK,
//         body: JSON.stringify(successResponse),
//       };
//     } else {
//       const errorResponse = {
//         error: "car with the provided ID not found",
//       };
//       return {
//         statusCode: StatusCodes.NOT_FOUND,
//         body: JSON.stringify(errorResponse),
//       };
//     }
//   } catch (error) {
//     console.error("An error occurred:", error);
//     return {
//       statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//       body: JSON.stringify({ message: "Something Went Wrong", error: error }),
//     };
//   }
// };

// // const pauseChain = async (chainId) => {
// //   try {
// //     const chain = await Chain.findById(chainId).lean();
// //     console.log('chain["isPaused"]', chain["isPause"]);

// //     const updatedChain = await Chain.findOneAndUpdate(
// //       { _id: chainId },
// //       { $set: { isPause: !chain["isPause"] } },
// //       { new: true }
// //     );
// //     const successResponse = {
// //       message: "Chain pause status updated successfully",
// //       data: updatedChain,
// //     };
// //     return {
// //       statusCode: StatusCodes.OK,
// //       body: JSON.stringify(successResponse),
// //     };
// //   } catch (error) {
// //     console.error("An error occurred:", error);
// //     return {
// //       statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
// //       body: JSON.stringify({ message: "Something Went Wrong", error: error }),
// //     };
// //   }
// // };
