import {Field, InputType, ObjectType} from "type-graphql";

@ObjectType("User")
export class UserGQL{
  @Field()
  email: string;
  @Field({nullable:true})
  phone?: string;
  @Field()
  name: string;
}

@InputType("UpdateUserInput")
export class UpdateUserInput{
  @Field({nullable:true})
  phone?: string;
  @Field({nullable:true})
  name?: string;
}
