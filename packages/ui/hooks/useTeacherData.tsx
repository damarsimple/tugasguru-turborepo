import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Classtype, Examtype, User } from "../types/type";

export default function useTeacherData() {
  const { data: { me } = {} } = useQuery<{
    me: User;
  }>(gql`
    query GetMe {
      me {
        subjects {
          id
          name
        }
        schools {
          id
          name
        }
        myclassrooms {
          id
          name
          school {
            id
          }
          classtype {
            id
          }
        }
      }
    }
  `);

  const { data: { classtypesAll, examtypesAll } = {} } = useQuery<{
    classtypesAll: Classtype[];
    examtypesAll: Examtype[];
  }>(gql`
    query GetMe {
      classtypesAll {
        id
        level
      }
      examtypesAll {
        id
        name
      }
    }
  `);
  return {
    subjects: me?.subjects,
    schools: me?.schools,
    classtypes: classtypesAll,
    examtypes: examtypesAll,
    myclassrooms: me?.myclassrooms,
  };
}
