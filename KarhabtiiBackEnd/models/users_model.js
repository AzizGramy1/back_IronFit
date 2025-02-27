const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    sexe: {
      type: String,
      enum: ["Homme", "Femme","Autre"],
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true, min: 18, max: 120 },
    image_user: { type: String, default: "Client.png" },
    role: {
      type: String,
      enum: ["admin", "client", "agent"],
      default: "client",
    },
    etat: { type: Boolean, default: false },
    type_User: {
      type: String,
      enum: ["Administrateur", "Client", "Visitor"],
      default: "Client",
    },
    date_inscrp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {   
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.post("save", function (doc, next) {
  console.log(`Nouvel utilisateur créé: ${doc.nom} ${doc.prenom}`);
  next();
});

const User = mongoose.model("User", userSchema);



module.exports = User;
