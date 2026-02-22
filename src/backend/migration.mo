import Nat "mo:core/Nat";
import List "mo:core/List";
import Map "mo:core/Map";

module {
  type Product = {
    store : Store;
    storeName : Text;
    storeCity : City;
    productID : Nat;
    title : Text;
    price : Nat;
    productUrl : Text;
    imageUrl : Text;
  };

  type Store = {
    id : Nat;
    url : Text;
    city : City;
    name : Text;
    averageShippingTime : Nat;
    reputationScore : Nat;
  };

  type City = {
    name : Text;
    proximityToQom : Nat;
  };

  type OldActor = {
    products : Map.Map<Nat, Product>;
    sellers : Map.Map<Nat, Store>;
    cities : List.List<City>;
  };

  type NewActor = {
    products : Map.Map<Nat, Product>;
    sellers : Map.Map<Nat, Store>;
    nextStoreId : Nat;
    cities : List.List<City>;
  };

  public func run(old : OldActor) : NewActor {
    { old with nextStoreId = 4 };
  };
};
