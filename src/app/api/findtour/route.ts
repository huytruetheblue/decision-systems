import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { City, Category, W, NumberRatio } from "@/constants";
interface IParams {
  query?: string;
}
// Return data from elasticsearch
export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { budget, city, typeOfTour } = body.params;
    if (city.length === 0) {
      city = City.map((item) => item.name);
    }
    budget = Number(budget);
    if (typeOfTour.length === 0) {
      typeOfTour = Category.map((item) => item.name);
    }
    const tours = await prisma.tours.findMany();
    if (budget === 0) {
      budget = Math.max(...tours.map((item) => item.Price));
    }
    const arr = Array.from({ length: tours.length }, () => Array(4).fill(0));
    let w_price: number = 0;
    let w_guide: number = 0;

    for (let i in tours) {
      if (city.includes(tours[i].City)) {
        arr[i][0] = W.city;
      }

      if (typeOfTour.includes(tours[i].Category)) {
        arr[i][1] = W.category;
      }

      if (tours[i].Price <= budget) {
        w_price += tours[i].Price ** 2;
      }
      arr[i][3] =
        tours[i].NumberPerTourGuide > NumberRatio
          ? 1 / (tours[i].NumberPerTourGuide - NumberRatio + 1)
          : 1 / (NumberRatio - tours[i].NumberPerTourGuide + 1);
      w_guide += arr[i][3] ** 2;
    }
    w_guide = Math.sqrt(w_guide);
    w_price = Math.sqrt(w_price);
    let maxPrice = 0;
    let minPrice = 1;
    let maxNumber = 0;
    let minNumber = 1;

    for (let i in tours) {
      if (tours[i].Price <= budget) {
        arr[i][2] = (tours[i].Price / w_price) * W.price;
        if (arr[i][2] > maxPrice) {
          maxPrice = arr[i][2];
        }
        if (arr[i][2] < minPrice) {
          minPrice = arr[i][2];
        }
      }
      arr[i][3] = (arr[i][3] / w_guide) * W.ratio;
      maxNumber = Math.max(maxNumber, arr[i][3]);
      minNumber = Math.min(minNumber, arr[i][3]);
    }
    let A_sao = Array(W.city, W.category, maxPrice, maxNumber);
    let A_tru = Array(W.city, W.category, minPrice, minNumber);
    let S_sao: number[] = [];
    let S_tru: number[] = [];
    let C_sao: number[] = [];
    let best_C_sao: number = 0;
    let best_S_tru: number = 0;
    let best_S_sao: number = 1;
    for (let i in tours) {
      if (arr[i][2] > 0) {
        S_sao[i] = Math.sqrt(
          (arr[i][0] - A_sao[0]) ** 2 +
            (arr[i][1] - A_sao[1]) ** 2 +
            (arr[i][2] - A_sao[2]) ** 2 +
            (arr[i][3] - A_sao[3]) ** 2
        );
        best_S_sao = Math.min(S_sao[i], best_S_sao);

        S_tru[i] = Math.sqrt(
          (arr[i][0] - A_tru[0]) ** 2 +
            (arr[i][1] - A_tru[1]) ** 2 +
            (arr[i][2] - A_tru[2]) ** 2 +
            (arr[i][3] - A_tru[3]) ** 2
        );
        best_S_tru = Math.max(S_tru[i], best_S_tru);

        C_sao[i] = S_tru[i] / (S_sao[i] + S_tru[i]);
        best_C_sao = Math.max(C_sao[i], best_C_sao);
      }
    }

    return NextResponse.json({
      best_C_sao: tours[C_sao.indexOf(best_C_sao)],
      best_S_tru: tours[S_tru.indexOf(best_S_tru)],
      best_S_sao: tours[S_sao.indexOf(best_S_sao)],
    });
  } catch (error) {
    return new NextResponse("Error:", { status: 500 });
  }
}
