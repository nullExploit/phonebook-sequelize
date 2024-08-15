var express = require("express");
var router = express.Router();

const { PhoneBook } = require("../models");
const { Op } = require("sequelize");
const path = require("path");
const { readdirSync, unlinkSync } = require("fs");

/* GET home page. */
router.get("/api/phonebooks", async (req, res) => {
  try {
    const { page = 1, limit, keyword, sort = "asc" } = req.query;
    const params = {};

    if (limit) {
      params.limit = limit;
      params.offset = (page - 1) * limit;
    }

    if (keyword) {
      params.where = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${keyword}%` } },
          { phone: { [Op.iLike]: `%${keyword}%` } },
        ],
      };
    }

    if (sort) {
      params.order = [["name", sort]];
    }
    const { count, rows } = await PhoneBook.findAndCountAll(params);

    res.json({
      phonebooks: rows,
      page: Number(page),
      limit: Number(limit),
      pages: limit ? Math.ceil(count / limit) : 1,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/api/phonebooks", async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) throw new Error("input your name or phone!");
    const phonebooks = await PhoneBook.create({ name, phone });
    res.status(201).json(phonebooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/api/phonebooks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, phone } = req.body;
    const params = {};

    if (!name && !phone) throw new Error("input your name or phone!");
    if (name) params.name = name;
    if (phone) params.phone = phone;

    const phonebooks = await PhoneBook.update(params, {
      where: {
        id: Number(id),
      },
      returning: true,
      plain: true,
    });
    res.status(201).json(phonebooks[1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/api/phonebooks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const phonebooks = await PhoneBook.destroy({
      where: {
        id: Number(id),
      },
    });

    for (let file of readdirSync(
      path.join(__dirname, "..", "..", "phonebook-uploads", "sequelize")
    )) {
      if (file.split("-")[1] == id) {
        unlinkSync(
          path.join(
            __dirname,
            "..",
            "..",
            "phonebook-uploads",
            "sequelize",
            file
          )
        );
      }
    }

    res.json(phonebooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/api/phonebooks/:id/avatar", async (req, res) => {
  try {
    const id = req.params.id;
    const { avatar } = req.body;
    const file = req.files?.file;
    const fileName = `${Date.now()}-${id}-${file?.name}`;
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "phonebook-uploads",
      "sequelize",
      fileName
    );

    for (let file of readdirSync(
      path.join(__dirname, "..", "..", "phonebook-uploads", "sequelize")
    )) {
      if (file.split("-")[1] == id) {
        unlinkSync(
          path.join(
            __dirname,
            "..",
            "..",
            "phonebook-uploads",
            "sequelize",
            file
          )
        );
      }
    }

    file && (await file.mv(filePath));

    if (!avatar) throw new Error("input your avatar!");
    const phonebooks = await PhoneBook.update(
      {
        avatar: fileName,
      },
      {
        where: {
          id: Number(id),
        },
        returning: true,
        plain: true,
      }
    );
    res.status(201).json(phonebooks[1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
