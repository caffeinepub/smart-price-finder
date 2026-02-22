import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

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

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.price, product2.price);
    };
  };

  type Store = {
    id : Nat;
    url : Text;
    city : City;
    name : Text;
    averageShippingTime : Nat; // in days
    reputationScore : Nat; // 1-5
  };

  type City = {
    name : Text;
    proximityToQom : Nat;
  };

  module City {
    public func get(name : Text) : City {
      switch (Iter.fromArray(cities.toArray()).find(func(city) { Text.equal(city.name, name) })) {
        case (?city) { city };
        case (null) { Runtime.trap("City '" # name # "' not found") };
      };
    };
  };

  let products = Map.empty<Nat, Product>();

  // Filtering function that returns products filtered by city
  func filterByCity(city : City) : [Product] {
    products.values().toArray().filter(func(product) { Text.equal(city.name, product.storeCity.name) });
  };

  // Add a new product to the system (admin only)
  public shared ({ caller }) func addProduct(
    store : Store,
    title : Text,
    price : Nat,
    productUrl : Text,
    imageUrl : Text,
  ) : async () {
    switch (products.get(0)) {
      case (null) {
        let product : Product = {
          store;
          storeName = store.name;
          storeCity = store.city;
          productID = 0;
          title;
          price;
          productUrl;
          imageUrl;
        };
        products.add(0, product);
      };
      case (?products) { Runtime.trap("Product already exists") };
    };
  };

  // Product Search function
  public query ({ caller }) func searchByProductTitle(title : Text) : async [Product] {
    let results = products.values().toArray().sort().filter(
      func(product) { product.title.contains(#text title) }
    );
    results;
  };

  // Custom store management
  var nextStoreId = 4; // Start after hardcoded sellers

  let sellers = Map.empty<Nat, Store>();

  /// Initialize hardcoded sellers
  public shared ({ caller }) func initializeSellers() : async () {
    sellers.add(
      1,
      {
        id = 1;
        url = "https://www.digikala.com/";
        city = City.get("Tehran");
        name = "Digikala";
        averageShippingTime = 2;
        reputationScore = 5;
      },
    );

    sellers.add(
      2,
      {
        id = 2;
        url = "https://www.bamilo.com/";
        city = City.get("Tehran");
        name = "Bamilo";
        averageShippingTime = 3;
        reputationScore = 4;
      },
    );

    sellers.add(
      3,
      {
        id = 3;
        url = "https://www.hiper.com/";
        city = City.get("Qom");
        name = "Hiper";
        averageShippingTime = 1;
        reputationScore = 3;
      },
    );
  };

  // Add custom store
  public shared ({ caller }) func addCustomStore(
    name : Text,
    url : Text,
    city : City,
    averageShippingTime : Nat,
    reputationScore : Nat,
  ) : async Nat {
    let storeId = nextStoreId;
    let newStore : Store = {
      id = storeId;
      name;
      url;
      city;
      averageShippingTime;
      reputationScore;
    };
    sellers.add(storeId, newStore);
    nextStoreId += 1;

    storeId;
  };

  // Available city list
  let cities : List.List<City> = List.fromArray<City>([
    { name = "Qom"; proximityToQom = 0 },
    { name = "Tehran"; proximityToQom = 1 },
    { name = "Mashhad"; proximityToQom = 2 },
    { name = "Isfahan"; proximityToQom = 2 },
    { name = "Tabriz"; proximityToQom = 3 },
    { name = "Shiraz"; proximityToQom = 3 },
    { name = "Ahvaz"; proximityToQom = 3 },
    { name = "Kermanshah"; proximityToQom = 4 },
    { name = "Rasht"; proximityToQom = 4 },
    { name = "Arak"; proximityToQom = 4 },
    { name = "Urmia"; proximityToQom = 5 },
    { name = "Yazd"; proximityToQom = 5 },
    { name = "Sari"; proximityToQom = 5 },
    { name = "Hamedan"; proximityToQom = 5 },
  ]);
};
