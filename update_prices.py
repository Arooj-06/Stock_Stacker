import os
import time
from datetime import date, timedelta
from dotenv import load_dotenv
from psx import stocks
from supabase import create_client

# Load variables from .env file
load_dotenv()

# 1. Configuration - pulling from .env
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# 2. Expanded PSX Stock List
STOCKS_TO_WATCH = [
    "UBL", "AHCL", "MCB", "HBL", "MARI", "ENGRO",
    "LUCK", "OGDC", "SYS", "PPL", "HUBC", "EFERT",
    "PSO", "MEBL", "TRG", "FFC", "DGKC", "KAPCO"
]


def update_psx_data():
    start_date = date.today() - timedelta(days=5)
    end_date = date.today()

    print(f"\n--- PSX Update Start: {end_date} ---")
    for symbol in STOCKS_TO_WATCH:
        try:
            df = stocks(symbol, start=start_date, end=end_date)
            if not df.empty:
                current_price = float(df['Close'].iloc[-1])
                supabase.table("stocks").update(
                    {"current_price": current_price}).eq("symbol", symbol).execute()
                print(f"✅ {symbol}: {current_price} PKR")
            else:
                print(f"⚠️ {symbol}: No data found.")
        except Exception as e:
            print(f"❌ Error for {symbol}: {e}")


if __name__ == "__main__":
    print("Stock Stacker Engine Started...")
    while True:
        update_psx_data()
        print("\nUpdate Cycle Complete. Waiting 120 seconds...")
        time.sleep(120)
