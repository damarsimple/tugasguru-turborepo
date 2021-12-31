import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { client } from "../pages/_app";
import { City, District, Province } from "../types/type";

export default function usePlaces({ useChain }: { useChain?: boolean }) {
  const [cityId, setCityId] = useState<string | undefined>(undefined);
  const [provinceId, setProvinceId] = useState<string | undefined>(undefined);
  const { data: { provincesAll } = {} } = useQuery<{
    provincesAll: Province[];
  }>(gql`
    query GetProvinces {
      provincesAll {
        id
        name
      }
    }
  `);
  const { data: { citiesAll } = {}, refetch: refetchCity } = useQuery<{
    citiesAll: City[];
  }>(
    gql`
      query GetProvinces($province_id: ID) {
        citiesAll(province_id: $province_id) {
          id
          name
        }
      }
    `,
    { variables: { province_id: provinceId } }
  );
  const { data: { districtsAll } = {}, refetch: refetchDistrict } = useQuery<{
    districtsAll: District[];
  }>(
    gql`
      query GetProvinces($city_id: ID) {
        districtsAll(city_id: $city_id) {
          id
          name
        }
      }
    `,
    { variables: { city_id: cityId } }
  );

  useEffect(() => {
    refetchCity();
  }, [provinceId, refetchCity]);

  useEffect(() => {
    refetchDistrict();
  }, [cityId, refetchDistrict]);

  return {
    provinces: provincesAll ?? [],
    cities: citiesAll ?? [],
    districts: districtsAll ?? [],
    setCityId,
    setProvinceId,
    cityId,
    provinceId,
  };
}
