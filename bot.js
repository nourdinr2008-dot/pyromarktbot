import { Telegraf, Markup } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  await ctx.reply(
    "PYROMARKT — Info & Toegang",
    Markup.inlineKeyboard([
      Markup.button.webApp("Bekijk Info & Toegang", process.env.WEBAPP_URL)
    ])
  );
});

bot.on("message", async (ctx) => {
  const wad = ctx.message?.web_app_data?.data;
  if (!wad) return;

  const data = JSON.parse(wad);

  if (data.action === "start_payment") {
    await ctx.replyWithInvoice({
      title: "Pyromarkt Premium",
      description: "Toegang betaalde groep",
      payload: "payment",
      provider_token: process.env.PROVIDER_TOKEN,
      currency: "EUR",
      prices: [{ label: "Toegang", amount: 2500 }]
    });
  }
});

bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));

bot.on("successful_payment", async (ctx) => {
  const invite = await ctx.telegram.createChatInviteLink(process.env.PAID_GROUP_ID, {
    member_limit: 1
  });

  await ctx.reply(
    "✅ Betaling ontvangen — join hieronder:",
    Markup.inlineKeyboard([
      Markup.button.url("Open Groep", invite.invite_link)
    ])
  );
});

bot.launch();

