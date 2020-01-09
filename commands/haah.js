// really don't like this file

const gm = require("gm").subClass({
  imageMagick: true
});
const gmToBuffer = require("../utils/gmbuffer.js");

exports.run = async (message) => {
  message.channel.sendTyping();
  const image = await require("../utils/imagedetect.js")(message);
  if (image === undefined) return `${message.author.mention}, you need to provide an image to mirror!`;
  const data = `/tmp/${Math.random().toString(36).substring(2, 15)}.${image.type}`;
  const data2 = `/tmp/${Math.random().toString(36).substring(2, 15)}.${image.type}`;
  gm(image.data).size((error, size) => {
    if (error) throw error;
    gm(image.data).gravity("West").crop("50%", 0).out("+repage").write(data2, (error) => {
      if (error) throw error;
      gm(data2).flop().write(data, async (error) => {
        if (error) throw error;
        const command = gm(data2).out("-repage", `${size.width}x${size.height}`).coalesce().out("null:").out("(").out(data).coalesce().out(")").geometry(`+${size.width / 2}+0`).out("-layers", "Composite");
        const resultBuffer = await gmToBuffer(command);
        return message.channel.createMessage("", {
          file: resultBuffer,
          name: `haah.${image.type}`
        });
      });
    });
  });
};

exports.aliases = ["magik4", "mirror2"];
exports.category = 5;
exports.help = "Mirrors the left side of an image onto the right";