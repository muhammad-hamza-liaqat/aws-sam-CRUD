import StatusCodes from "http-status-codes";
import carModel from "./car.model.mjs";
import {
  HTTPError,
  HTTPResponse,
  DBConn,
  catchError,
} from "./utils/helper.mjs";

export const handler = async (event) => {
  try {
    await DBConn();
    const method = event.httpMethod;
    const path = event.path;
    const pathParams = event.pathParameters;
    const body = event.body;
    const queryParams = event.queryStringParameters || {};

    switch (method) {
      case "GET":
        if (path === "/getAllCars") {
          return await getAllCars(queryParams);
        } else if (
          path.startsWith("/getCarById/") &&
          pathParams &&
          pathParams.id
        ) {
          return await getCarById(pathParams.id);
        }
        break;
      case "POST":
        if (path === "/addCars") {
          return await addCars(body);
        }
        break;
      case "PUT":
        if (path.startsWith("/updateCar/") && pathParams && pathParams.id) {
          return await updateCar(pathParams.id, body);
        }
        break;
      case "DELETE":
        if (path.startsWith("/deleteCar/") && pathParams && pathParams.id) {
          return await deleteCar(pathParams.id);
        }
        break;
      default:
        return {
          statusCode: StatusCodes.METHOD_NOT_ALLOWED,
          body: JSON.stringify({
            message: "Endpoint not allowed",
          }),
        };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: "Something Went Wrong", error: error }),
    };
  }
};

const getAllCars = async (queryParams) => {
  try {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    const carData = await carModel.find({}).skip(skip).limit(limit);
    const totalCarCount = await carModel.countDocuments();
    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify({
        message: "cars fetched successfully",
        data: carData,
        totalCarCount: totalCarCount,
        currentPage: page,
        totalPages: Math.ceil(totalCarCount / limit),
      }),
    };
  } catch (error) {
    console.error("An error occurred:", error);
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: "Something Went Wrong", error: error }),
    };
  }
};

const getCarById = async (carId) => {
  try {
    if (!carId) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: JSON.stringify({
          error: "Invalid car ID provided",
        }),
      };
    }
    const car = await carModel.findById(carId);
    if (!car) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: JSON.stringify({
          error: "car not found",
        }),
      };
    }
    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify({
        message: "Successfully fetched car",
        data: car,
      }),
    };
  } catch (error) {
    console.error("An error occurred:", error);
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: "Something Went Wrong", error: error }),
    };
  }
};

export const addCars = async (requestBody) => {
  try {
    const requestData = JSON.parse(requestBody);
    const { carName, Make, Model, Variant, Price, imported } = requestData;
    const carNew = new carModel(requestData);
    await carNew.save();
    let response = new HTTPResponse("car created successfully", carNew);
    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return await catchError(error);
  }
};

const updateCar = async (carId, requestBody) => {
  try {
    const requestData = JSON.parse(requestBody);
    const updatedCar = await carModel.findOneAndUpdate(
      { _id: carId },
      requestData,
      {
        new: true,
      }
    );
    if (updatedCar) {
      const successResponse = {
        message: "car updated successfully",
        data: updatedCar,
      };
      return {
        statusCode: StatusCodes.OK,
        body: JSON.stringify(successResponse),
      };
    } else {
      const response = new HTTPError(
        "No car found with the provided ID",
        StatusCodes.NOT_FOUND
      );
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: JSON.stringify(response),
      };
    }
  } catch (error) {
    return await catchError(error);
  }
};

const deleteCar = async (carID) => {
  try {
    if (!carID) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: JSON.stringify({
          error: "Invalid car ID provided",
        }),
      };
    }
    const deletedCar = await carModel.findOneAndDelete({
      _id: carID,
    });
    if (deletedCar) {
      const successResponse = {
        message: "car successfully deleted",
        data: deletedCar,
      };
      return {
        statusCode: StatusCodes.OK,
        body: JSON.stringify(successResponse),
      };
    } else {
      const errorResponse = {
        error: "car with the provided ID not found",
      };
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: JSON.stringify(errorResponse),
      };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: "Something Went Wrong", error: error }),
    };
  }
};
