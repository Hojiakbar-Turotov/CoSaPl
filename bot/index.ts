/**
 * 🎓 CoSaPl (Coursework Sales Platform) — Telegram Bot Server & Auth Handler
 * Bot Token: 8524480392:AAHprzTtdi44561eAuuo_j4cVyTLoRrd_jI
 * 
 * Avtorizatsiya jarayoni:
 * 1. Foydalanuvchi /start bosadi
 * 2. Bot F.I.SH (Ism, Familiya, Otasining ismi) ni so'raydi
 * 3. Bot Telefon raqamini yuborishni (Share Contact tugmasi orqali) so'raydi
 * 4. Tizimda ro'yxatdan o'tkazib, Telegram Mini App (cosapl.web.app) tugmasini beradi.
 */

export interface TelegramBotConfig {
  token: string;
  webAppUrl: string;
  adminChatId: string;
}

export const config: TelegramBotConfig = {
  token: process.env.TELEGRAM_BOT_TOKEN || '8524480392:AAHprzTtdi44561eAuuo_j4cVyTLoRrd_jI',
  webAppUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://cosapl.web.app',
  adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '123456789',
};

// User Registration Session state interface
export interface UserSession {
  telegramId: number | string;
  username?: string;
  step: 'AWAITING_NAME' | 'AWAITING_PHONE' | 'REGISTERED';
  fullName?: string;
  phone?: string;
}

export const sessions: Record<string, UserSession> = {};

/**
 * Step 1: /start bosilganda
 */
export function handleStartCommand(telegramId: number | string, username?: string) {
  sessions[telegramId.toString()] = {
    telegramId,
    username,
    step: 'AWAITING_NAME',
  };

  return {
    text: `Assalomu alaykum! 🎓\n\n<b>CoSaPl (Coursework Sales Platform)</b> rasmiy botiga xush kelibsiz!\n\nPlatformadan to'liq foydalanish va shaxsiy kabinetingizni faollashtirish uchun, iltimos, <b>to'liq F.I.SH (Ism, Familiya)</b>ingizni yozib yuboring:`,
    reply_markup: {
      remove_keyboard: true,
    },
  };
}

/**
 * Step 2: F.I.SH kiritilganda
 */
export function handleNameInput(telegramId: number | string, fullName: string) {
  const session = sessions[telegramId.toString()] || {
    telegramId,
    step: 'AWAITING_NAME',
  };

  session.fullName = fullName.trim();
  session.step = 'AWAITING_PHONE';
  sessions[telegramId.toString()] = session;

  return {
    text: `Rahmat, <b>${session.fullName}</b>! 👍\n\nEndi, iltimos, pastdagi <b>«📱 Telefon raqamni yuborish»</b> tugmasini bosing yoki telefon raqamingizni kiriting (+998901234567):`,
    reply_markup: {
      keyboard: [
        [
          {
            text: '📱 Telefon raqamni yuborish',
            request_contact: true,
          },
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
}

/**
 * Step 3: Telefon raqam kiritilganda (Auth yakunlanishi)
 */
export function handlePhoneInput(telegramId: number | string, phone: string, webAppUrl: string = config.webAppUrl) {
  const session = sessions[telegramId.toString()];
  const fullName = session?.fullName || 'Foydalanuvchi';

  if (session) {
    session.phone = phone;
    session.step = 'REGISTERED';
  }

  return {
    text: `🎉 <b>Tabriklaymiz, ro'yxatdan muvaffaqiyatli o'tdingiz!</b>\n\n👤 <b>F.I.SH:</b> ${fullName}\n📞 <b>Telefon:</b> ${phone}\n\nQuyidagi tugma orqali <b>CoSaPl</b> platformasini to'g'ridan-to'g'ri ochishingiz mumkin 👇`,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🚀 CoSaPl Platformasini Ochish',
            web_app: { url: `${webAppUrl}?tg_id=${telegramId}&name=${encodeURIComponent(fullName)}&phone=${encodeURIComponent(phone)}` },
          },
        ],
        [
          { text: '📚 Katalog', callback_data: 'cmd_katalog' },
          { text: '✍️ Buyurtma berish', callback_data: 'cmd_buyurtma' },
        ],
        [
          { text: '📜 Antiplagiat (antiplag.uz)', callback_data: 'cmd_antiplagiat' },
          { text: '💳 Balans', callback_data: 'cmd_balans' },
        ],
        [
          { text: '👨‍💻 Admin bilan aloqa', url: 'https://t.me/CoSaPl_Admin' },
          { text: '📢 Rasmiy Kanal', url: 'https://t.me/CoSaPl_Kanal' },
        ],
      ],
    },
  };
}
