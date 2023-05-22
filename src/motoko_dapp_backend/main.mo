import Float "mo:base/Float";
import Int "mo:base/Int";

actor {
  // add
  public func add(x : Float, y : Float) : async Float {
    var add : Float = x + y;
    return add;
  };

  // sub
  public func sub(x : Float, y : Float) : async Float {
    var sub : Float = x - y;
    return sub;
  };

  // mul
  public func mul(x : Float, y : Float) : async Float {
    var mul : Float = x * y;
    return mul;
  };

  // div
  public func div(x : Float, y : Float) : async Float {
    var div : Float = x / y;
    return div;
  };
};
